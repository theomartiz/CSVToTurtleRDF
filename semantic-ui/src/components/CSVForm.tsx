import React, {useEffect, useRef, useState} from 'react';
import {Field, Form, Formik, FormikProps} from 'formik';
import ApiServices from "../ApiServices";
import FormSchema from "../schemas/FormSchema";

interface FormValues {
    titleLine: number,
    firstLine: number,
    lastLine?: number,
    separator: "," | ";" | "tab" | "espace" | "|",
    prefixData: string,
    prefixPredicate: string,
    fileName: string,
}

const FormItem: React.FC<{ children: JSX.Element[], className?: string }> = ({children, className}) => {
    return <div className={"max-w-xl mt-10 flex " + className}>{children}</div>
}

type Props = {
    file?: File,
    setResult: (arg: string) => void,
    fileName?: string,
    setFileName: (arg: string) => void
    setShowAlert: (arg: string) => void
};

const CSVForm: React.FC<Props> = ({file, setResult, fileName, setFileName, setShowAlert}) => {
    const initialValuesFallback: FormValues = {
        titleLine: 1,
        firstLine: 2,
        lastLine: undefined,
        separator: ",",
        prefixData: "<http://ex.org/data/>",
        prefixPredicate: "<http://ex.org/pred#>",
        fileName: ""
    };

    const [hasTitleLine, setHasTitleLine] = useState(true);
    const [initialValues, setInitialValues] = useState(initialValuesFallback);
    const formikRef = useRef<FormikProps<FormValues>>(null);

    useEffect(() => {
        ApiServices.getConfig()
            .then(response => {
                setInitialValues({
                    ...initialValuesFallback,
                    titleLine: response.data.title_line,
                    firstLine: response.data.first_line,
                    separator: response.data.sep,
                    prefixData: response.data.prefix_data,
                    prefixPredicate: response.data.prefix_predicate,
                })
            });
    }, []);

    useEffect(() => {
        if (fileName) {
            setInitialValues({
                ...initialValuesFallback,
                fileName: fileName
            });
        }
    }, [fileName]);


    const handleSubmit = (values: FormValues) => {
        if (file) {
            setFileName(values.fileName);
            ApiServices.processFile(
                values.separator,
                hasTitleLine ? values.titleLine : 0,
                values.firstLine,
                values.prefixPredicate,
                values.prefixData,
                file,
                values.lastLine
            )
                .then(response => setResult(response.data))
                .catch(error => {
                    if (error.response) {
                        setShowAlert(error.response.data.detail)
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data.detail);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log("error.request", error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                });
        } else {
            alert("Vous devez ajouter un fichier avant de procéder au traitement.");
        }
    }

    useEffect(() => {
        if (formikRef.current) {
            hasTitleLine ? formikRef.current.setFieldValue("titleLine", 1) : formikRef.current.setFieldValue("titleLine", 0);
        }
    }, [hasTitleLine]);


    return (
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={FormSchema}
                enableReinitialize
            >
                {({errors, touched}) => (
                    <Form className="my-5">
                        <FormItem className="flex-row items-center">
                            <label htmlFor="hasHeader" className="mr-4 block text-gray-700 text-sm font-bold">Votre fichier
                                contient-il une ligne de titre ?</label>
                            <input type="checkbox" id="hasHeader" name="hasHeader" checked={hasTitleLine}
                                   onChange={() => setHasTitleLine(prevState => !prevState)}/>
                        </FormItem>

                        <FormItem className={`flex-col ${hasTitleLine ? "" : "opacity-50"}`}>
                            <label htmlFor="titleLine" className="block text-gray-700 text-sm font-bold">N° de la ligne de
                                titres</label>
                            <Field
                                className={`${hasTitleLine ? "" : "cursor-not-allowed"} bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gold`}
                                id="titleLine" name="titleLine"
                                placeholder="Ligne de titres" type="number" min="1" disabled={!hasTitleLine}/>
                        </FormItem>
                        {errors.titleLine && touched.titleLine ? (
                            <div className="text-red text-sm">{errors.titleLine}</div>
                        ) : null}

                        <FormItem className={`flex-col`}>
                            <label htmlFor="firstLine" className="block text-gray-700 text-sm font-bold">N° de la première
                                ligne
                                de données</label>
                            <Field id="firstLine" name="firstLine"
                                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gold"
                                   placeholder="Première ligne" type="number" min="1"/>
                        </FormItem>
                        {errors.firstLine && touched.firstLine ? (
                            <div className="text-red text-sm">{errors.firstLine}</div>
                        ) : null}

                        <FormItem className={`flex-col`}>
                            <label htmlFor="lastLine" className="block text-gray-700 text-sm font-bold">N° de la dernière
                                ligne
                                de données</label>
                            <Field id="lastLine" name="lastLine"
                                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gold"
                                   placeholder="Dernière ligne du fichier" type="number" min="1"/>
                        </FormItem>
                        {errors.lastLine && touched.lastLine ? (
                            <div className="text-red text-sm">{errors.lastLine}</div>
                        ) : null}

                        <FormItem className={`flex-col`}>
                            <label htmlFor="separator" className="block text-gray-700 text-sm font-bold">Séparateur</label>
                            <Field id="separator" name="separator" as="select"
                                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gold"
                            >
                                <option value=",">,</option>
                                <option value=";">;</option>
                                <option value="tab">tab</option>
                                <option value="espace">espace</option>
                                <option value="|">|</option>
                            </Field>
                        </FormItem>
                        {errors.separator && touched.separator ? (
                            <div className="text-red text-sm">{errors.separator}</div>
                        ) : null}

                        <FormItem className={`flex-col`}>
                            <label htmlFor="prefixData" className="block text-gray-700 text-sm font-bold">Préfixe lié aux
                                données</label>
                            <Field id="prefixData" name="prefixData" placeholder="Préfixe"
                                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gold"
                            />
                        </FormItem>
                        {errors.prefixData && touched.prefixData ? (
                            <div className="text-red text-sm">{errors.prefixData}</div>
                        ) : null}

                        <FormItem className={`flex-col`}>
                            <label htmlFor="prefixPredicate" className="block text-gray-700 text-sm font-bold">Préfixe lié
                                aux
                                prédicats</label>
                            <Field id="prefixPredicate" name="prefixPredicate" placeholder="Préfixe"
                                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gold"
                            />
                        </FormItem>
                        {errors.prefixPredicate && touched.prefixPredicate ? (
                            <div className="text-red text-sm">{errors.prefixPredicate}</div>
                        ) : null}

                        <FormItem className={`flex-col`}>
                            <label htmlFor="fileName" className="block text-gray-700 text-sm font-bold">Nom du
                                fichier</label>
                            <Field id="fileName" name="fileName" placeholder="Préfixe"
                                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gold"
                            />
                        </FormItem>
                        {errors.fileName && touched.fileName ? (
                            <div className="text-red text-sm">{errors.fileName}</div>
                        ) : null}

                        <button type="submit" className="block mx-auto rounded bg-gold px-5 py-1 mt-5">Envoyer</button>
                    </Form>
                )}
            </Formik>
    );
};

export default CSVForm;

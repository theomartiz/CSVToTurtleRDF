import * as Yup from 'yup';

const FormSchema = Yup.object().shape({
    titleLine: Yup.number()
        .min(0)
        .required("Champs requis"),
    firstLine: Yup.number()
        .min(1)
        .moreThan(Yup.ref('titleLine'), "La première ligne de données doit être supérieure à la ligne de titres.")
        .required("Champs requis"),
    lastLine: Yup.number()
        .positive()
        .moreThan(Yup.ref('firstLine'), "La dernière ligne de données doit être supérieure à la première."),
    separator: Yup.string().required("Champs requis"),
    prefixData: Yup.string().required("Champs requis"),
    prefixPredicate: Yup.string().required("Champs requis"),
    fileName: Yup.string().required("Champs requis")
});

export default FormSchema;

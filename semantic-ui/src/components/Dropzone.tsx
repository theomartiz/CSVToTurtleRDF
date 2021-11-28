import React, {useCallback} from 'react';
import {useDropzone} from "react-dropzone";

type DropzoneProps = {
    handleSetFile: (arg: File) => void,
};

const Dropzone: React.FC<DropzoneProps> = ({handleSetFile}) => {

    const onDrop = useCallback((acceptedFile) => {
        if (acceptedFile[0]) handleSetFile(acceptedFile[0]);
    }, [handleSetFile]);

    const {getRootProps, getInputProps, isDragActive, isDragAccept} = useDropzone({
        onDrop,
        accept: [".csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values, text/plain"],
        multiple: false
    });

    return (
        <div {...getRootProps()}
             className="border border-dashed border-grey w-full rounded flex justify-center items-center h-40 cursor-pointer">
            <input {...getInputProps()} />
            {
                isDragActive ?
                    (isDragAccept ?
                        <p>Lâchez le fichier ici...</p> :
                        <p>Ce fichier n'est pas un CSV...</p>) :
                    <p>Glissez-déposez votre fichier CSV ici ou appuyez pour le sélectionner</p>
            }
        </div>
    );
};

export default Dropzone;

import React, {useState} from 'react';
import Header from "./components/Header";
import Dropzone from "./components/Dropzone";
import CSVForm from "./components/CSVForm";
import Popup from "reactjs-popup";
import ResultViewer from "./components/ResultViewer";

function App() {
    const [file, setFile] = useState<File>();
    const [sourceText, setSourceText] = useState("");
    const [result, setResult] = useState<string>();
    const [fileName, setFileName] = useState<string>();

    const handleSetFile = (inputFile: File) => {
        setFile(inputFile);
        setFileName(inputFile.name.split('.')[0]);
        inputFile.text().then(text => setSourceText(text));
    }

    const handleResetResult = () => {
        setResult(undefined);
        setFile(undefined);
    }

    return (
        <div className="app">
            <Header/>
            {result ?
                <ResultViewer fileName={fileName} result={result} handleReset={handleResetResult}/> :
                <section className="max-w-xl mx-auto pt-20">
                    <Dropzone handleSetFile={handleSetFile}/>
                    <div className="flex items-center px-10 my-2 justify-center">
                        <p className="font-medium">Fichier: <span className="font-light">{file ? file.name : "Aucun fichier"}</span></p>
                        {sourceText &&
                        <Popup modal arrow={false} position="center center" trigger={
                            <button className="bg-gold rounded ml-5 px-4 py-2 text-sm">Visualiser</button>
                        }>
                            <div className="p-5 bg-white shadow min-w-300 max-h-screen-3/4 overflow-auto">
                                <h3 className="font-semibold text-xl">Contenu de votre fichier</h3>
                                <p className="whitespace-pre-line">{sourceText}</p>
                            </div>
                        </Popup>}
                    </div>
                    <CSVForm file={file} setResult={setResult} fileName={fileName} setFileName={setFileName}/>
                </section>
            }
        </div>
    );
}

export default App;

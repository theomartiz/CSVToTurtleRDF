import React from 'react';

type ResultViewerProps = {
    result:string,
    handleReset:()=>void,
    fileName?:string
};

const ResultViewer: React.FC<ResultViewerProps> = ({result,handleReset,fileName}) => {
    const downloadTtlFile = () => {
        const element = document.createElement("a");
        const file = new Blob([result], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${fileName}.ttl`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    }

    return (
      <section className="max-w-xl mx-auto pt-20 mb-5">
          <div className="mb-4 flex justify-between w-full">
              <h2 className="font-semibold text-xl">Votre résultat</h2>
              <button className="block rounded bg-gold px-5 py-1" onClick={downloadTtlFile}>Télécharger</button>
              <button className="block rounded bg-gold px-5 py-1" onClick={handleReset}>Nouveau traitement</button>
          </div>
          <p className="border border-grey rounded p-2 bg-gray-200 whitespace-pre-wrap">{result}</p>
      </section>
  );
};

export default ResultViewer;

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ChevronDown, ChevronUp, Eye, Code, Zap, Download, Upload, Columns, CheckCircle, GitCompare } from 'lucide-react';
import '../About.module.css';
import '../../../app/globals.css'

// Carga dinámica de librerías para Excel y comparación difusa
const loadScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};

declare global {
    interface Window {
        XLSX: any;
        Fuse: any;
    }
}

interface ExcelRow {
  [key: string]: string | number | boolean | undefined;
  _highlighted?: boolean;
}

interface PythonScriptsShowcaseProps {
  onClose: () => void;
}

export default function PythonScriptsShowcase({ onClose }: PythonScriptsShowcaseProps) {
  const [currentView, setCurrentView] = useState('selection'); // 'selection' o 'tool'
  const [activeScriptKey, setActiveScriptKey] = useState<string | null>(null);
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [progress, setProgress] = useState(0);

  const [cex, setCex] = useState({
    excelFile1: null as File | null, excelFile2: null as File | null, columns1: '', columns2: '',
    baseFile: 'file1', doFuzzy: false, processing: false, error: null as string | null,
    resultData: null as any[] | null, highlightedWorkbook: null as any, exactMatchesText: '', fuzzyMatchesText: ''
  });
  
  const [libsReady, setLibsReady] = useState(false);
  const [uiState, setUiState] = useState('input'); // 'input', 'simulating', 'results'

  useEffect(() => {
    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js")
    ]).then(() => {
      setLibsReady(true);
    }).catch(err => {
      setCex(prev => ({ ...prev, error: 'No se pudieron cargar las librerías externas.' }));
    });
  }, []);

  const scripts: {[key: string]: any} = {
    cex_comparador: {
      name: 'Comparador de Excel (CEX)',
      icon: GitCompare,
      color: 'bg-indigo-500',
      description: 'Compara dos archivos Excel, genera reportes de coincidencias exactas y difusas, y resalta las filas en un archivo base.',
      inputFormat: '2x XLSX',
      outputFormat: 'XLSX Resaltado + 2x TXT',
      steps: [
        { name: 'Leyendo Archivos Excel', detail: 'Procesando datos de ambos archivos...', duration: 1000 },
        { name: 'Realizando Comparación Exacta', detail: 'Buscando coincidencias idénticas...', duration: 1200 },
        { name: 'Generando Reporte Exacto', detail: 'Creando `coincidencias_exactas.txt`...', duration: 600 },
        { name: 'Realizando Comparación Difusa (Opcional)', detail: 'Buscando similitudes entre cadenas...', duration: 1500 },
        { name: 'Generando Reporte Difuso', detail: 'Creando `coincidencias_difusas.txt`...', duration: 600 },
        { name: 'Resaltando Filas en Archivo Base', detail: 'Aplicando formato de color a las celdas...', duration: 1000 },
        { name: 'Proceso Completado', detail: 'Mostrando resultados y descargas.', duration: 500 }
      ],
      instructions: [
        '# Cómo Replicar el Proyecto (cex.py)',
        '',
        'Este script unificado realiza la comparación y el resaltado.',
        '',
        '## Requisitos',
        '```bash',
        'pip install pandas openpyxl thefuzz',
        '```',
        '',
        '## Script Principal (`cex.py`)',
        '```python',
        'import os',
        'import pandas as pd',
        'from openpyxl import load_workbook',
        'from openpyxl.styles import PatternFill',
        'from thefuzz import fuzz',
        '',
        '# (Aquí iría el contenido completo de tu script cex.py)',
        '# ...',
        '# El script debe contener funciones como:',
        '# - comparar_columnas_exacto()',
        '# - comparar_columnas_difuso()',
        '# - resaltar_coincidencias_exactas()',
        '# - Y un main() que orqueste todo el proceso.',
        '# ...',
        '```'
      ].join('\n')
    },
  };
  
  const activeScript = activeScriptKey ? scripts[activeScriptKey] : null;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && activeScript && currentStep < activeScript.steps.length) {
      const currentStepConfig = activeScript.steps[currentStep];
      if ((currentStepConfig.name.includes('Difusa') && !cex.doFuzzy)) {
          setCurrentStep(prev => prev + 1);
          return;
      }
      timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + (100 / activeScript.steps.filter((s: any) => cex.doFuzzy || !s.name.includes('Difusa')).length), 100));
        setCurrentStep(prev => prev + 1);
      }, currentStepConfig.duration);
    } else if (isRunning && activeScript && currentStep >= activeScript.steps.length) {
      setIsRunning(false);
      setUiState('results');
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep, activeScript, cex.doFuzzy]);

  const selectScript = (key: string) => {
    setActiveScriptKey(key);
    setCurrentView('tool');
    resetCex();
  };
  
  const backToSelection = () => {
      if (currentView === 'selection') {
        onClose();
      } else {
        setActiveScriptKey(null);
        setCurrentView('selection');
      }
  }

  const runSimulation = () => {
    if (isRunning) return;
    setUiState('simulating');
    setCurrentStep(0);
    setProgress(0);
    setIsRunning(true);
  };
  
  const resetCex = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setProgress(0);
    setUiState('input');
    setCex({
        excelFile1: null, excelFile2: null, columns1: '', columns2: '',
        baseFile: 'file1', doFuzzy: false, processing: false, error: null, resultData: null,
        highlightedWorkbook: null, exactMatchesText: '', fuzzyMatchesText: ''
    });
  };

  const handleCexFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileKey: string) => {
    if (e.target.files) {
        setCex(prev => ({ ...prev, [fileKey]: e.target.files![0], error: null }));
    }
  };

  const handleCexProcess = async () => {
    const { excelFile1, excelFile2, columns1, columns2, doFuzzy, baseFile } = cex;
    if (!excelFile1 || !excelFile2 || !columns1 || !columns2) {
      setCex(prev => ({ ...prev, error: 'Por favor, completa todos los campos.' }));
      return;
    }
    setCex(prev => ({ ...prev, processing: true, error: null }));

    try {
      const [data1, data2] = await Promise.all([excelFile1.arrayBuffer(), excelFile2.arrayBuffer()]);
      const json1: ExcelRow[] = window.XLSX.utils.sheet_to_json(window.XLSX.read(data1).Sheets[window.XLSX.read(data1).SheetNames[0]], { defval: "" });
      const json2: ExcelRow[] = window.XLSX.utils.sheet_to_json(window.XLSX.read(data2).Sheets[window.XLSX.read(data2).SheetNames[0]], { defval: "" });

      const cols1 = columns1.split(',').map(c => c.trim());
      const cols2 = columns2.split(',').map(c => c.trim());
      const getRowString = (row: any, cols: string[]) => cols.map(c => String(row[c] || '').trim().toLowerCase()).join(' | ');

      const set1 = new Set(json1.map((row: any) => getRowString(row, cols1)));
      const set2 = new Set(json2.map((row: any) => getRowString(row, cols2)));
      
      const exact_matches = [...set1].filter(item => set2.has(item));
      const exactMatchesText = sorted(exact_matches).join('\n');
      const exactMatchesSet = new Set(exact_matches);

      let fuzzyMatchesText = '';
      if (doFuzzy) {
        const fuse = new window.Fuse(json2.map((row: any) => getRowString(row, cols2)), { threshold: 0.4 });
        const fuzzy_matches = json1.map((row1: any) => getRowString(row1, cols1)).filter((row1String: string) => fuse.search(row1String).length > 0);
        fuzzyMatchesText = sorted([...new Set(fuzzy_matches)]).join('\n');
      }

      const baseFileJson = baseFile === 'file1' ? json1 : json2;
      const baseFileCols = baseFile === 'file1' ? cols1 : cols2;

      const highlightedData = baseFileJson.map((row: any) => ({
        ...row,
        _highlighted: exactMatchesSet.has(getRowString(row, baseFileCols))
      }));
      
      const dataForSheet = highlightedData.map(row => {
          const newRow = {...row};
          delete newRow._highlighted;
          return newRow;
      });
      const newWs = window.XLSX.utils.json_to_sheet(dataForSheet);

      highlightedData.forEach((row, rowIndex) => {
        if (row._highlighted) {
          const cellRange = window.XLSX.utils.decode_range(newWs['!ref']);
          for (let C = cellRange.s.c; C <= cellRange.e.c; ++C) {
            const address = window.XLSX.utils.encode_cell({ r: rowIndex + 1, c: C });
            if (newWs[address]) {
              newWs[address].s = { fill: { fgColor: { rgb: "FFFFFF00" } } };
            }
          }
        }
      });
      
      const newWb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(newWb, newWs, "Resaltado");

      setCex(prev => ({ ...prev, processing: false, resultData: highlightedData, highlightedWorkbook: newWb, exactMatchesText, fuzzyMatchesText }));
      runSimulation();
    } catch (err: any) {
      setCex(prev => ({ ...prev, processing: false, error: `Error: ${err.message}` }));
    }
  };

  const handleDownload = (type: string) => {
    let text: string = '';
    let filename: string = '';
    if (type === 'exact') {
        text = cex.exactMatchesText;
        filename = 'coincidencias_exactas.txt';
    } else if (type === 'fuzzy') {
        text = cex.fuzzyMatchesText;
        filename = 'coincidencias_difusas.txt';
    }

    if (text || text === "") {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (type === 'xlsx' && cex.highlightedWorkbook) {
      const baseFileName = cex.baseFile === 'file1' ? cex.excelFile1!.name : cex.excelFile2!.name;
      const newName = `resaltado_${baseFileName}`;
      window.XLSX.writeFile(cex.highlightedWorkbook, newName, { cellStyles: true });
    }
  };

  const renderSelectionScreen = () => (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <button onClick={onClose} className="absolute top-4 right-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
              &times;
            </button>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Portafolio de Scripts
            </h1>
            <p className="text-gray-300 text-lg">Selecciona una herramienta para comenzar</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(scripts).map(([key, script]) => (
                <div key={key} onClick={() => selectScript(key)} className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50 text-center cursor-pointer hover:border-indigo-500 hover:scale-105 transition-all duration-300">
                    <div className={`w-16 h-16 ${script.color} rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <script.icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{script.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{script.description}</p>
                    <span className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">Ejecutar Herramienta</span>
                </div>
            ))}
        </div>
      </div>
  );

  const renderToolInterface = () => {
    if (!activeScript) return null;
    
    const renderCexInteractivePanel = () => (
      <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50 h-full flex flex-col">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Zap className="text-yellow-400" />Configuración de Comparación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="block"><span className="text-gray-300 text-sm font-medium mb-2 block">1. Archivo Excel 1</span><div className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-md border border-gray-600"><Upload size={18} className="text-blue-400" /><span className="text-sm text-gray-200 truncate">{cex.excelFile1?.name || 'No seleccionado'}</span><input type="file" accept=".xlsx" className="hidden" onChange={(e) => handleCexFileChange(e, 'excelFile1')} /><button onClick={(e) => (e.currentTarget.previousSibling as HTMLElement).click()} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs rounded">Elegir</button></div></label>
              <label className="block"><span className="text-gray-300 text-sm font-medium mb-2 block">2. Archivo Excel 2</span><div className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-md border border-gray-600"><Upload size={18} className="text-green-400" /><span className="text-sm text-gray-200 truncate">{cex.excelFile2?.name || 'No seleccionado'}</span><input type="file" accept=".xlsx" className="hidden" onChange={(e) => handleCexFileChange(e, 'excelFile2')} /><button onClick={(e) => (e.currentTarget.previousSibling as HTMLElement).click()} className="ml-auto bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs rounded">Elegir</button></div></label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <label className="block"><span className="text-gray-300 text-sm font-medium mb-2 block">3. Columnas Archivo 1</span><div className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-md border border-gray-600"><Columns size={18} className="text-blue-400" /><input type="text" value={cex.columns1} onChange={(e) => setCex(prev => ({ ...prev, columns1: e.target.value }))} placeholder="Ej: ID, Nombre" className="w-full bg-transparent text-white focus:outline-none text-sm"/></div></label>
              <label className="block"><span className="text-gray-300 text-sm font-medium mb-2 block">4. Columnas Archivo 2</span><div className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-md border border-gray-600"><Columns size={18} className="text-green-400" /><input type="text" value={cex.columns2} onChange={(e) => setCex(prev => ({ ...prev, columns2: e.target.value }))} placeholder="Ej: ID_Producto" className="w-full bg-transparent text-white focus:outline-none text-sm"/></div></label>
          </div>
          <div className="mb-4"><span className="text-gray-300 text-sm font-medium mb-2 block">5. Archivo a resaltar</span><div className="flex gap-4 rounded-lg bg-gray-700/50 p-1"><button onClick={() => setCex(prev => ({ ...prev, baseFile: 'file1' }))} className={`flex-1 text-center text-sm py-1.5 rounded-md transition-colors ${cex.baseFile === 'file1' ? 'bg-indigo-600 font-semibold' : 'hover:bg-gray-600'}`}>Archivo 1</button><button onClick={() => setCex(prev => ({ ...prev, baseFile: 'file2' }))} className={`flex-1 text-center text-sm py-1.5 rounded-md transition-colors ${cex.baseFile === 'file2' ? 'bg-indigo-600 font-semibold' : 'hover:bg-gray-600'}`}>Archivo 2</button></div></div>
          <div className="mb-4"><label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={cex.doFuzzy} onChange={(e) => setCex(prev => ({ ...prev, doFuzzy: e.target.checked }))} className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500" />Buscar coincidencias difusas (similitud)</label></div>
          <button onClick={handleCexProcess} disabled={cex.processing || !libsReady} className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition-all disabled:bg-gray-600 disabled:cursor-not-allowed">{cex.processing ? 'Procesando...' : !libsReady ? 'Cargando librerías...' : 'Comparar y Simular'}</button>
          {cex.error && <div className="mt-3 text-red-400 text-sm bg-red-900/50 p-2 rounded-md">{cex.error}</div>}
      </div>
    );

    const renderCexResultsPanel = () => (
      <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50 h-full flex flex-col">
          <h3 className="font-semibold text-lg mb-4">Resultados de la Comparación</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <button onClick={() => handleDownload('exact')} disabled={!cex.exactMatchesText && cex.exactMatchesText !== ""} className="flex items-center justify-center gap-2 py-2 px-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold disabled:bg-gray-600"><Download size={14} /> Exactas (.txt)</button>
              <button onClick={() => handleDownload('fuzzy')} disabled={!cex.fuzzyMatchesText && cex.fuzzyMatchesText !== ""} className="flex items-center justify-center gap-2 py-2 px-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-semibold disabled:bg-gray-600"><Download size={14} /> Difusas (.txt)</button>
              <button onClick={() => handleDownload('xlsx')} disabled={!cex.highlightedWorkbook} className="flex items-center justify-center gap-2 py-2 px-2 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-semibold disabled:bg-gray-600"><Download size={14} /> Resaltado (.xlsx)</button>
          </div>
          <div className="flex-grow bg-black/50 rounded-lg p-2 border border-gray-700 overflow-auto"><table className="w-full text-xs text-left"><thead className="sticky top-0 bg-gray-800"><tr>{cex.resultData && cex.resultData.length > 0 && Object.keys(cex.resultData[0]).filter(k => k !== '_highlighted').map(key => <th key={key} className="p-2 font-medium text-gray-300">{key}</th>)}</tr></thead><tbody>{cex.resultData?.map((row, index) => (<tr key={index} className={row._highlighted ? 'bg-yellow-800/50' : 'bg-transparent'}>{Object.keys(row).filter(k => k !== '_highlighted').map(key => <td key={key} className="p-2 border-t border-gray-700">{String(row[key])}</td>)}</tr>))}</tbody></table></div>
          <div className="mt-4 border border-gray-600 rounded-lg"><button onClick={() => setShowInstructions(!showInstructions)} className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/50"><span className='font-semibold'>Cómo Replicar el Proyecto</span>{showInstructions ? <ChevronUp/> : <ChevronDown/>}</button>{showInstructions && <div className="p-4 border-t border-gray-600 bg-gray-900/50 prose prose-invert max-w-none prose-pre:bg-black/50 prose-pre:p-4 prose-pre:rounded-lg prose-pre:text-sm"><pre><code>{activeScript.instructions}</code></pre></div>}</div>
      </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-3"><activeScript.icon className="text-indigo-400" />{activeScript.name}</h2>
              <button onClick={backToSelection} className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm">Volver</button>
            </div>
            <p className="text-gray-300 mb-6">{activeScript.description}</p>
            <div className="mb-6"><div className="flex justify-between text-sm text-gray-400 mb-2"><span>Progreso de Simulación</span><span>{Math.round(progress)}%</span></div><div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" style={{ width: `${progress}%` }} /></div></div>
            <div className="space-y-3"><h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Eye className="text-purple-400" />Pasos del Proceso</h3>{activeScript.steps.filter((s: any) => cex.doFuzzy || !s.name.includes('Difusa')).map((step: any, index: number) => (<div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${index < currentStep ? 'bg-green-500/20 border-green-500/30' : ''} ${index === currentStep && isRunning ? 'bg-blue-500/20 border-blue-500/30 animate-pulse' : 'bg-gray-700/30 border-gray-600/30'}`}><div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${index < currentStep ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'}`}>{index < currentStep ? <CheckCircle/> : index + 1}</div><div><div className="font-medium">{step.name}</div><div className="text-sm text-gray-400">{step.detail}</div></div></div>))}</div>
          </div>
          <div className="relative">
             <div className={`transition-opacity duration-500 ${uiState === 'input' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>{renderCexInteractivePanel()}</div>
             <div className={`absolute inset-0 transition-opacity duration-500 ${uiState === 'results' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>{renderCexResultsPanel()}</div>
             {uiState === 'simulating' && (<div className="absolute inset-0 flex items-center justify-center z-20"><div className="text-center p-8 bg-gray-800/80 rounded-lg backdrop-blur-md"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto"></div><p className="mt-4 text-lg font-semibold">Simulando Proceso...</p></div></div>)}
          </div>
        </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white p-4 sm:p-6 font-sans overflow-y-auto">
      {currentView === 'selection' ? renderSelectionScreen() : renderToolInterface()}
    </div>
  );
}

function sorted(arr: string[]) {
    return arr.slice().sort((a, b) => a.localeCompare(b));
} 

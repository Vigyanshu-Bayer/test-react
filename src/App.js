import React, {  useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './Component/header';
import FileUpload from './Component/FileUpload';
import { Spinner } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import Modal from 'react-bootstrap/Modal';
import Footer from './Component/Footer';
// import Response from './Component/Response';

function App() {
  const [loader, setLoader] = useState(false);
  const [resType, setResType] = useState("review");
  const [activeTab, setActiveTab] = useState("test-case-generation"); // Default tab is now Test Case Generation
  const [notification, setNotification] = useState({
    show: false,
    body: ""
  });
  const [response,setResponse] = useState([])
  const [suggestions,setSuggestions] = useState([])
  
  // States for Code Generation and Code Conversion
  const [codeGenForm, setCodeGenForm] = useState({
    technologyType: '',
    framework: '',
    repositoryUrl: '',
    userRequirement: ''
  });
  
  const [codeConvForm, setCodeConvForm] = useState({
    technologyType: '',
    sourceLanguage: '',
    destinationLanguage: '',
    repositoryUrl: '',
    additionalInstructions: ''
  });

  // Modal states for Code Generation and Code Conversion results
  const [codeGenModalShow, setCodeGenModalShow] = useState(false);
  const [codeConvModalShow, setCodeConvModalShow] = useState(false);
  const [codeGenResult, setCodeGenResult] = useState('');
  const [codeConvResult, setCodeConvResult] = useState('');

  // Framework options based on technology type
  const frameworkOptions = {
    Frontend: ['React', 'Vue', 'JavaScript', 'Angular', 'HTML', 'CSS'],
    Backend: ['Python', 'Java', 'ASP.NET', 'Django', 'Node.js', 'Spring Boot', 'PHP', 'Flask'],
    Database: ['Oracle', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite']
  };

  // const [apiResponse, setApiResponse] = useState([]);
  const handleSubmit = (data, type, project_name, assigned_to, testCaseType) => {
    //event.preventDefault();
    console.log(data)
    if (data.file.length) {
      setLoader(true);
      let postData = {
        user_story_description: data.userStory,
        file: data.file,
        application_type: type,
        project_name: project_name,
        assigned_to: assigned_to
      }
      if(testCaseType === 'existing'){
        postData.testCaseType = testCaseType;
        postData.existingFile = data.existingFile;
      }
      axios.post(`http://10.31.3.17:5000/generate-test-cases`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': '*/*'
        }
      })
        .then(res => {
          console.log(res)
          setLoader(false);
          if(res.status === 200){
            setNotification({
              show:true,
              body:res.data.message,
              type:'success'
            })
            setResponse(res.data.test_cases)
            setSuggestions(res.data.suggestions)
            setResponseShow(true)
          }else{
            setNotification({
              show:true,
              body:"Something went wrong !!",
              type:'danger'
            })
          }
          
        })
      

    }
  }

  // Handle Code Generation form submission
  const handleCodeGenSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    
    // Simulate API call - Replace this with your actual API call
    setTimeout(() => {
      setLoader(false);
      // Mock response - Replace with actual API response
      const mockResult = `// Generated ${codeGenForm.framework} code for ${codeGenForm.technologyType}\n\n` +
        `// Technology: ${codeGenForm.technologyType}\n` +
        `// Framework: ${codeGenForm.framework}\n` +
        `// Repository: ${codeGenForm.repositoryUrl}\n\n` +
        `// User Requirements:\n// ${codeGenForm.userRequirement}\n\n` +
        `// Generated Code:\nfunction generatedCode() {\n  // Your generated code will appear here\n  console.log('Code generated successfully!');\n}\n\nmodule.exports = generatedCode;`;
      
      setCodeGenResult(mockResult);
      setCodeGenModalShow(true);
      
      setNotification({
        show: true,
        body: "Code generated successfully!",
        type: 'success'
      });
    }, 2000);
  };

  // Handle technology type change and reset framework for Code Generation
  const handleTechnologyChange = (value) => {
    setCodeGenForm({
      ...codeGenForm,
      technologyType: value,
      framework: '' // Reset framework when technology type changes
    });
  };

  // Handle technology type change for Code Conversion
  const handleConvTechnologyChange = (value) => {
    setCodeConvForm({
      ...codeConvForm,
      technologyType: value,
      sourceLanguage: '',
      destinationLanguage: ''
    });
  };

  // Handle source language change for Code Conversion
  const handleSourceLanguageChange = (value) => {
    setCodeConvForm({
      ...codeConvForm,
      sourceLanguage: value,
      destinationLanguage: '' // Reset destination language when source changes
    });
  };

  // Get destination language options (exclude selected source language)
  const getDestinationOptions = () => {
    if (!codeConvForm.technologyType || !codeConvForm.sourceLanguage) {
      return [];
    }
    return frameworkOptions[codeConvForm.technologyType].filter(
      option => option !== codeConvForm.sourceLanguage
    );
  };

  // Handle Code Conversion form submission
  const handleCodeConvSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    
    // Simulate API call - Replace this with your actual API call
    setTimeout(() => {
      setLoader(false);
      // Mock response - Replace with actual API response
      const mockResult = `// Code Conversion Result\n\n` +
        `// Technology Type: ${codeConvForm.technologyType}\n` +
        `// Source Language: ${codeConvForm.sourceLanguage}\n` +
        `// Destination Language: ${codeConvForm.destinationLanguage}\n` +
        `// Repository: ${codeConvForm.repositoryUrl}\n\n` +
        `// Additional Instructions:\n// ${codeConvForm.additionalInstructions}\n\n` +
        `// Converted Code:\n// Original ${codeConvForm.sourceLanguage} code has been converted to ${codeConvForm.destinationLanguage}\n\n` +
        `function convertedCode() {\n  // Your converted code will appear here\n  console.log('Code converted from ${codeConvForm.sourceLanguage} to ${codeConvForm.destinationLanguage}!');\n}\n\nexport default convertedCode;`;
      
      setCodeConvResult(mockResult);
      setCodeConvModalShow(true);
      
      setNotification({
        show: true,
        body: "Code converted successfully!",
        type: 'success'
      });
    }, 2000);
  };

  const download = () =>{
    setLoader(true);
    axios.post(`http://10.31.3.17:5000/download-test-cases`, [], {
            responseType: 'blob'
          
        }).then(res => {
                setLoader(false);
                if(res.status === 200){
                  const url = window.URL.createObjectURL(new Blob([res.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'test_cases.xlsx'); // Name of the file to be downloaded
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  setNotification({
                    show:true,
                    body:"Downloaded Successfully",
                    type:'success'
                  })
                }else{
                  setNotification({
                    show:true,
                    body:"Something went wrong !!",
                    type:'danger'
                  })
                }
                
              })
  }
  const [responseShow, setResponseShow] = useState(false);

  const handleResClose = () => setResponseShow(false);
  const handleCodeGenClose = () => setCodeGenModalShow(false);
  const handleCodeConvClose = () => setCodeConvModalShow(false);

  // Code Generation Content Component
  const CodeGenerationContent = () => (
    <div className="code-generation-content">
      <form className="code-tab-form" onSubmit={handleCodeGenSubmit}>
        {/* Row with two dropdowns */}
        <div className="formRow">
          <div>
            <label className="formLabel">Select Technology Type:</label>
            <select
              className="formfield_select input_dark"
              value={codeGenForm.technologyType}
              onChange={(e) => handleTechnologyChange(e.target.value)}
              required
            >
              <option value="">Select Technology Type</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
            </select>
          </div>
          <div>
            <label className="formLabel">Select Framework/Code Language:</label>
            <select
              className="formfield_select input_dark"
              value={codeGenForm.framework}
              onChange={(e) => setCodeGenForm({...codeGenForm, framework: e.target.value})}
              required
              disabled={!codeGenForm.technologyType}
            >
              <option value="">Select Framework/Language</option>
              {codeGenForm.technologyType && frameworkOptions[codeGenForm.technologyType].map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Repository URL field */}
        <div>
          <label className="formLabel">Repository Url/Name:</label>
          <input
            type="text"
            className="formfield_select input_dark"
            value={codeGenForm.repositoryUrl}
            onChange={(e) => setCodeGenForm({...codeGenForm, repositoryUrl: e.target.value})}
            placeholder="Enter repository URL or name..."
          />
        </div>
        
        {/* User Requirement field */}
        <div>
          <label className="formLabel">User Requirement:</label>
          <textarea
            className="formfield_ta input_dark"
            value={codeGenForm.userRequirement}
            onChange={(e) => setCodeGenForm({...codeGenForm, userRequirement: e.target.value})}
            placeholder="Enter your requirements..."
            required
            rows="8"
          />
        </div>
        
        {/* Generate button */}
        <div>
          <button type="submit" className="btn btn-primary formButton">
            Generate
          </button>
        </div>
      </form>
    </div>
  );

  // Code Conversion Content Component
  const CodeConversionContent = () => (
    <div className="code-conversion-content">
      <form className="code-tab-form" onSubmit={handleCodeConvSubmit}>
        {/* Technology Type dropdown */}
        <div>
          <label className="formLabel">Select Technology Type:</label>
          <select
            className="formfield_select input_dark"
            value={codeConvForm.technologyType}
            onChange={(e) => handleConvTechnologyChange(e.target.value)}
            required
          >
            <option value="">Select Technology Type</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
          </select>
        </div>

        {/* Row with Source and Destination Language dropdowns */}
        <div className="formRow">
          <div>
            <label className="formLabel">Source Language:</label>
            <select
              className="formfield_select input_dark"
              value={codeConvForm.sourceLanguage}
              onChange={(e) => handleSourceLanguageChange(e.target.value)}
              required
              disabled={!codeConvForm.technologyType}
            >
              <option value="">Select Source Language</option>
              {codeConvForm.technologyType && frameworkOptions[codeConvForm.technologyType].map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="formLabel">Destination Language:</label>
            <select
              className="formfield_select input_dark"
              value={codeConvForm.destinationLanguage}
              onChange={(e) => setCodeConvForm({...codeConvForm, destinationLanguage: e.target.value})}
              required
              disabled={!codeConvForm.sourceLanguage}
            >
              <option value="">Select Destination Language</option>
              {getDestinationOptions().map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Repository URL field */}
        <div>
          <label className="formLabel">Repository Url/Name:</label>
          <input
            type="text"
            className="formfield_select input_dark"
            value={codeConvForm.repositoryUrl}
            onChange={(e) => setCodeConvForm({...codeConvForm, repositoryUrl: e.target.value})}
            placeholder="Enter repository URL or name..."
          />
        </div>
        
        {/* Additional Instructions field - MADE SHORTER */}
        <div>
          <label className="formLabel">Add Your Additional Instructions:</label>
          <textarea
            className="formfield_select input_dark"
            value={codeConvForm.additionalInstructions}
            onChange={(e) => setCodeConvForm({...codeConvForm, additionalInstructions: e.target.value})}
            placeholder="Enter your additional instructions..."
            rows="3"
            style={{height: 'auto', minHeight: '80px'}}
          />
        </div>
        
        {/* Convert button */}
        <div>
          <button type="submit" className="btn btn-primary formButton">
            Convert
          </button>
        </div>
      </form>
    </div>
  );

  console.log(loader,"loader")
  return (
    <>
      <Header />
      <Toast className="d-inline-block m-1 toast" bg={notification.type} onClose={() => setNotification(prevState =>( { ...prevState,show:false }))} show={notification.show} position="top-end" autohide>
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body className='text-white'>{notification.body}</Toast.Body>
      </Toast>

      {/* Main Tab Navigation */}
      <div className="main-tabs">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'test-case-generation' ? 'active' : ''}`}
              onClick={() => setActiveTab('test-case-generation')}
            >
              Test Case Generation
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'code-generation' ? 'active' : ''}`}
              onClick={() => setActiveTab('code-generation')}
            >
              Code Generation
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'code-conversion' ? 'active' : ''}`}
              onClick={() => setActiveTab('code-conversion')}
            >
              Code Conversion
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="tab-content-wrapper">
        {activeTab === 'test-case-generation' && (
          <div className="test-case-gen-content">
            <FileUpload handleSubmit={handleSubmit} setNotification={setNotification} />
          </div>
        )}
        {activeTab === 'code-generation' && <CodeGenerationContent />}
        {activeTab === 'code-conversion' && <CodeConversionContent />}
      </div>

      {loader && (<div style={{position: "absolute",width: "100vw",height: "100vh",zIndex: 30,top: 0,'backgroundColor': "#00000082"}}>
        <div className="text-center mt-4" style={{position: 'relative',top:'50%'}}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>

      </div>)}
      {
        // (uploadedFiles.length)?<Response apiResponse={apiResponse}/> : <FileUpload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}/>
      }
      
      {/* <!--Test Case Response Modal --> */}
      <Modal show={responseShow} size='xl' onHide={handleResClose} dialogClassName="formbody_dark modal_body" backdrop="static"
        keyboard={false}>
        <Modal.Header>
          <Modal.Title>
          <ul className="nav nav-tabs Restab">
                <li className="nav-item">
                    <label className={"nav-link" + (resType === 'review'? " active":"")} aria-current="page" onClick={e=>setResType('review')}>Review</label>
                </li>
                <li className="nav-item">
                    <label className={"nav-link" + (resType === 'suggestions'? " active":"")} onClick={e=>setResType('suggestions')}>Suggestions</label>
                </li>
            </ul>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {(resType === 'review') && <table className='resTable'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th style={{width: '10%'}}>Test Step</th>
                        <th>Step Actions</th>
                        <th>Steps Expected</th>
                    </tr>
                </thead>
                <tbody>
                    {response.map((ele,key)=>{
                      return(<tr key={key}>
                        <td>{ele.Title}</td>
                        <td>{ele['Test Step']}</td>
                        <td>{ele['Step Action']}</td>
                        <td>{ele['Step Expected']}</td>
                      </tr>)
                    })}
                </tbody>    
            </table>}
            {(resType === 'suggestions') && <div><pre className='textWrap'>{suggestions.map((e, index) => <React.Fragment key={index}>{e.suggestion + "\n"}</React.Fragment>)}</pre></div>}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={e=>download()}>
            Download
          </button>
          <button className="btn btn-secondary" onClick={handleResClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Code Generation Result Modal */}
      <Modal show={codeGenModalShow} size='xl' onHide={handleCodeGenClose} dialogClassName="formbody_dark modal_body" backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Code Generation Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre className='textWrap' style={{backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '20px', borderRadius: '5px', fontSize: '14px', fontFamily: 'Consolas, Monaco, monospace'}}>{codeGenResult}</pre>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCodeGenClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Code Conversion Result Modal */}
      <Modal show={codeConvModalShow} size='xl' onHide={handleCodeConvClose} dialogClassName="formbody_dark modal_body" backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Code Conversion Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre className='textWrap' style={{backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '20px', borderRadius: '5px', fontSize: '14px', fontFamily: 'Consolas, Monaco, monospace'}}>{codeConvResult}</pre>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCodeConvClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <Footer></Footer>
    </>
  );
}

export default App;


// import React from "react";
// import "./App.css";

// function App() {
//   return (
//     <div className="App">
//       <h1>Hello, React!</h1>
//       <p>This is a basic React app.</p>
//     </div>
//   );
// }

// export default App;

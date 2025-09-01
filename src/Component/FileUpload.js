import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-bootstrap/Modal';

// import "../App.css"
const FileUpload = (props) => {
    const { handleSubmit,setNotification } = props;
    const [type, setType] = useState("Non-GxP");
    const [projectNames, setProjectNames] = useState([]);
    const [testCase, setTestCase] = useState("");
    const [projectName, setProjectName] = useState("");
    const [userDetails, setUserDetails] = useState([]);
    const [assignedTo, setAssignedTo] = useState("");
    const url = 'http://10.31.3.17:5000'
    useEffect(() => {
        if( type!==""){
        axios({
            method: 'post',
            url: url+'/api/application-project-info',
            data: {
                application_type: type,
            },
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'accept': '*/*'
            }
        }).then(res => {
            if(res.status === 200){
            setProjectNames(res.data.project_names)
            }
          })
        }
    },[type])

    useEffect(() => {
        if( projectName!==""){
        axios({
            method: 'post',
            url: url+'/api/application-project-info',
            data: {
                application_type: type,
                project_name: projectName,
            },
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'accept': '*/*'
            }
        }).then(res => {
            if(res.status === 200){
                // console.log(res.data)
            setUserDetails(res.data.names_and_emails)
            }
          })
        }
    },[type,projectName])
    // const { userStory, setUserStory } = useState("");
    // const { acceptanceCriteria, setacceptanceCriteria } = useState("");
    const [ data, setData ] = useState({
        userStory : "",
        acceptanceCriteria : "",
        file : [],
        existingFile : []
    });
   
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            
            // setUploadedFiles(acceptedFiles);
            setData(prevData =>{
                const updatedFiles = [...prevData.file]; // Make a copy of the existing files

            // Push each accepted file into the updatedFiles array
            acceptedFiles.forEach(file => updatedFiles.push(file));
               return {...prevData,file:updatedFiles}
        })
            // Call your backend API endpoint to upload files
        },
    });
    const { getRootProps:getRootPropsExisting, getInputProps:getInputPropsExisting } = useDropzone({
        onDrop: (acceptedFiles) => {
            // setUploadedFiles(acceptedFiles);
            setData({...data,existingFile:acceptedFiles})
            // Call your backend API endpoint to upload files
        },
    });
 
    const setApplicationType = (t) => {
        setType(t);
    }
    const changeProjectName = (t) => {
        setProjectName(t);
    }
    const changeAssignedTo = (t) => {
        setAssignedTo(t);
    }
 
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // console.log(projectNames)

    const [userInfo, setUserInfo] = useState({
        cwid: "",
        name: "",
        email: "",
        project_name: "",
        application_type: "Non-GxP"
      });
    
    const handleModalSubmit = () =>{
        axios({
            method: 'post',
            url: url+'/insert-user-info',
            data: userInfo,
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'accept': '*/*'
            }
        }).then(res => {
            if(res.status === 200 || res.status === 201){
                setNotification({
                  show:true,
                  body:res.data.message,
                  type:'success'
                })
                handleClose()
              }else{
                setNotification({
                  show:true,
                  body:"Something went wrong !!",
                  type:'danger'
                })
                handleClose()
              }
          })
    }
    return (
        <>  
            <div className='formbody formbody_dark'>
                {/*-- 1. "Add Tester/Project" button moved here and wrapped in a div --*/}
                <div>
                   <button type="button" className="btn btn-primary btnAdd" onClick={handleShow}>
                        + Add Tester / Project
                   </button>
                </div>
            
                {/*-- 2. Redundant "Non-GxP" tab UI has been removed from here --*/}
                
                <div className='formRow'>
                <div>
                <label htmlFor="project_names" className='formLabel'>Choose Project Name:</label>
                <select id="project_names" className='formfield_select input_dark' value={projectName} onChange={(e) => changeProjectName(e.target.value)}>
                <option value="">Select</option>
                {
                    projectNames.map((t, index) => (
                        <option key={index} value={t}>{t}</option>
                    ))
                }
                </select>
                </div>
                <div>
                <label htmlFor="assigned_to" className='formLabel'>Tester:</label>
                {/* <!-- Button trigger modal --> */}
                
                <select id="assigned_to" className='formfield_select input_dark' value={assignedTo} onChange={(e) => changeAssignedTo(e.target.value)}>
                <option value="">Select</option>
                {
                    userDetails.map((t, index) => {
                        const userInfo = t.split(";");
                        return (<option key={index} value={`${userInfo[0]} <${userInfo[1]}>`}>{userInfo[0]}</option>)
                    })
                }
                </select>
                </div>
                {/* <div>
                <label htmlFor="application_type" className='formLabel'>Choose Test Case Type:</label>
                <select id="application_type" className='formfield_select input_dark' value={testCase} onChange={(e) => setTestCase(e.target.value)}>
                <option value="">Select</option>
                <option value="new">New Test Case</option>
                <option value="existing">Existing Test Case</option>
                </select>
                </div> */}
                </div>
                <div className='formRow'>
                <div>
                <label htmlFor="user_story_description" className='formLabel'>Enter User Story Description:</label>
                <textarea id="user_story_description" className='formfield_ta input_dark'
                    type="textarea"
                    value={data.userStory}
                    onChange={(e) => setData({...data,userStory:e.target.value})} />
           
                </div>
                {/* <div>
                <label htmlFor="acceptance_criteria" className='formLabel'>Enter Acceptance Criteria:</label>
                <textarea id="acceptance_criteria" className='formfield_ta input_dark'
                    type="textarea"
                    value={data.acceptanceCriteria}
                    onChange={(e) => setData({...data,acceptanceCriteria:e.target.value})} />
           
                </div> */}
                </div>
                <div className='formRow'>
                <div>
                    <label htmlFor="acceptance_criteria" className='formLabel'>Upload Application High Level Description:</label>
                
                    <div {...getRootProps()}>
                    <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
                        <div className="flex flex-col p-2">
                            <div className="dropzone">
                                <div className="flex max-w-[480px] flex-col items-center text-center gap-2">
                                    <p className="font-weight-bold text-center">
                                        Click to browse or drag and drop your files
                                    </p>    
    
                                    {data.file.length !== 0 && <><p className="font-weight-bold text-center"> Selected Files
                                        </p><ul style={{ display: 'inline-block'}}>
                                                {data.file.map((ele, key) => {
                                                    return (<li key={key}>{ele.name}</li>);
                                                })}
                                            </ul></>}
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <input {...getInputProps()} />
                    </div>
                    
                </div>
                <div>
                {testCase === 'existing'  && <>   
                <label htmlFor="acceptance_criteria" className='formLabel'>Upload Existing Test Case:</label>
                
                <div {...getRootPropsExisting()}>
                <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
                    <div className="flex flex-col p-2">
                        <div className="dropzone">
                            <div className="flex max-w-[480px] flex-col items-center text-center gap-2">
                                <p className="font-weight-bold text-center">
                                    Click to browse or drag and drop your files
                                </p>    

                                {data.file.length !== 0 && <><p className="font-weight-bold text-center"> Selected Files
                                    </p><ul style={{ display: 'inline-block'}}>
                                            {data.existingFile.map((ele, key) => {
                                                return (<li key={key}>{ele.name}</li>);
                                            })}
                                        </ul></>}
                            </div>
                        </div>
                    </div>
                </div>

                <input {...getInputPropsExisting()} />
                </div>
                </> }  </div>
                </div>
            
            <div>
                <button onClick={e=>handleSubmit(data, type, projectName, assignedTo, testCase)} className='btn btn-primary formButton'>Submit</button>
            </div>
        </div>
        

        {/* <!-- Modal --> */}
        <Modal show={show} onHide={handleClose} dialogClassName="formbody_dark">
        <Modal.Header closeButton>
          <Modal.Title>Add User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
            <table><tbody>
                <tr>
                    <td>CWID:</td>
                    <td><input className='formfield_select input_dark' type='text' onChange={e => setUserInfo({...userInfo,cwid:e.target.value})}/></td>
                </tr>
                <tr>
                    <td>Name:</td>
                    <td><input className='formfield_select input_dark' type='text' onChange={e => setUserInfo({...userInfo,name:e.target.value})}/></td>
                </tr>
                <tr>
                    <td>E-Mail:</td>
                    <td><input className='formfield_select input_dark' type='text' onChange={e => setUserInfo({...userInfo,email:e.target.value})}/></td>
                </tr>
                <tr>
                    <td>Project Name: <i title='Select project name same as in ADO'>&nbsp;<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                </svg></i></td>
                    <td><input className='formfield_select input_dark' type='text' onChange={e => setUserInfo({...userInfo,project_name:e.target.value})}/></td>
                </tr>
                {/* <tr>
                    <td>Application Type:</td>
                    <td><select className='formfield_select input_dark' onChange={e => setUserInfo({...userInfo,application_type:e.target.value})}>
                        <option value="">Select</option>
                        <option value="GxP">GxP</option>
                        <option value="Non-GxP">Non-GxP</option>
                    </select></td>
                </tr> */}
                </tbody>    
            </table>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={e =>handleModalSubmit()}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
      
      
        </>
    );
};
export default FileUpload;
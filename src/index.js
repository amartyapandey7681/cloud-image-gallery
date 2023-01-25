import React ,{useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';

import AWS from 'aws-sdk'

import './index.css'



AWS.config.update({
    accessKeyId: '',
    secretAccessKey: ''
})

const myBucket = new AWS.S3({
    params: { Bucket: ""},
    region: "",
})

const UploadImageToS3WithNativeSdk = () => {

    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFile = (file) => {

        const params = {
            ACL: '',
            Body: file,
            Bucket: "",
            Key: file.name
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })
    }


    return <div className='imp'>
        <div className='sm'>(refresh page to see new images)</div>
        <div className='pro'>Progress {progress}%</div>
        <input  className="inp" type="file" onChange={handleFileInput}/>
        <button className="btn" onClick={() => uploadFile(selectedFile)}> Upload Image</button>
    </div>
}

function Getitems(){


  let [data,setData] = useState([]);


  
  const run = async () => {
    var params = {
      Bucket: '',
      Delimiter: '/'
    };
    
    myBucket.listObjects(params, function(err, dat) {
      if (err) {
        return 'There was an error viewing your album: ' + err.message
      } else {
        console.log(dat.Contents,"<<<all content");

        let r = [];
                    
        dat.Contents.forEach(function(obj,index) {
          console.log(obj.Key,"<<<file path")


          if(obj.Key.endsWith('.jpeg') || obj.Key.endsWith('.jpg'))
            r.push(''+obj.Key)
        })

        setData(r);
      }
    })
  };


  useEffect(()=>{


    run();

  },[])

  if(data.length === 0){

    return <>
    <h2>no items got</h2></>
  }

  return <div className='items'>

    {data.map((val)=>{

      return <img src={val} />

    })}

  </div>
}

function Nav(){


  return <nav>
    <h2>Cloud Image Gallery</h2>
  </nav>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Nav />
    <UploadImageToS3WithNativeSdk />
    <Getitems />
  </React.StrictMode>
);

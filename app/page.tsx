"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";


type AnalysisResult = {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  resumeChanges: string[];
};


export default function Home() {

  const [jobDescription, setJobDescription] = useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  const [loading, setLoading] =
    useState(false);


  const onDrop = (files: File[]) => {

    const file = files[0];


    if(file && file.type === "application/pdf"){

      setSelectedFile(file);

    }
    else{

      alert("Please upload a PDF file.");

    }

  };


  const {
    getRootProps,
    getInputProps,
    isDragActive

  } = useDropzone({

    onDrop,

    accept:{
      "application/pdf":[".pdf"]
    },

    multiple:false

  });



  async function analyzeJob(){

    if(!selectedFile || !jobDescription.trim()){

      alert(
        "Please upload your CV and add a job description."
      );

      return;

    }


    setLoading(true);

    setResult(null);



    const formData = new FormData();

    formData.append(
      "cv",
      selectedFile
    );

    formData.append(
      "jobDescription",
      jobDescription
    );



    try{


      const response = await fetch(
        "/api/analyze",
        {
          method:"POST",
          body:formData
        }
      );


      const data = await response.json();


      console.log(
        "API RESPONSE:",
        data
      );



      if(!response.ok){

        throw new Error(
          data.error || "Analysis failed"
        );

      }



      setResult(data.result);



    }

    catch(error){

      console.error(error);

      alert(
        "Something went wrong while analyzing."
      );

    }


    finally{

      setLoading(false);

    }

  }



  return (

    <main className="
      min-h-screen
      bg-gradient-to-br
      from-blue-50
      via-white
      to-purple-50
      flex
      items-center
      justify-center
      p-8
    ">


      <div className="
        bg-white
        rounded-3xl
        shadow-2xl
        p-10
        max-w-5xl
        w-full
      ">



        <h1 className="
          text-5xl
          font-extrabold
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          bg-clip-text
          text-transparent
        ">
          CareerPilot AI
        </h1>


        <p className="
          text-gray-600
          mt-3
          mb-8
          text-lg
        ">
          AI-powered CV analyzer that matches your resume
          with real job requirements.
        </p>



        <label className="font-semibold">
          Upload your CV
        </label>



        <div

          {...getRootProps()}

          className={`
          mt-3
          border-2
          border-dashed
          rounded-2xl
          p-10
          text-center
          cursor-pointer

          ${
            isDragActive
            ?
            "border-blue-600 bg-blue-50"
            :
            "border-gray-300 hover:border-blue-500"
          }

          `}
        >

          <input {...getInputProps()} />


          <div className="text-4xl">
            📄
          </div>


          {

          isDragActive ?

          <p className="text-blue-600 font-semibold">
            Drop your CV here
          </p>

          :

          <>

          <p className="font-semibold">
            Drag & drop PDF here
          </p>

          <p className="text-gray-500">
            or click to browse
          </p>

          </>

          }


        </div>




        {
        selectedFile &&

        <div className="
          mt-4
          bg-green-50
          border
          border-green-200
          rounded-xl
          p-4
          text-green-700
        ">

          ✅ {selectedFile.name}

        </div>

        }




        <label className="
          block
          mt-8
          mb-3
          font-semibold
        ">
          Job Description
        </label>


        <textarea

          value={jobDescription}

          onChange={
            e=>setJobDescription(e.target.value)
          }

          placeholder="
          Paste the job description here...
          "

          className="
          w-full
          h-56
          border
          rounded-xl
          p-4
          outline-none
          focus:ring-2
          focus:ring-blue-500
          "

        />




        <button

          onClick={analyzeJob}

          disabled={loading}

          className="
          mt-5
          w-full
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          text-white
          font-bold
          py-4
          rounded-xl
          disabled:opacity-50
          "

        >

          {
          loading
          ?
          "Analyzing CV..."
          :
          "Analyze Job"
          }

        </button>





        {
        result &&

        <div className="
          mt-10
          space-y-6
        ">


          <section className="
            border
            rounded-2xl
            p-6
            text-center
          ">


            <h2 className="text-xl font-bold">
              🎯 Job Match Score
            </h2>


            <p className="
              text-6xl
              font-extrabold
              text-blue-600
              mt-3
            ">

              {result.score}%

            </p>


          </section>





          <div className="
            grid
            md:grid-cols-2
            gap-6
          ">


          <SkillBox

          title="✅ Matching Skills"

          items={result.matchingSkills}

          color="green"

          />



          <SkillBox

          title="❌ Missing Skills"

          items={result.missingSkills}

          color="red"

          />


          </div>




          <ListBox

          title="💡 Improvement Suggestions"

          items={result.suggestions}

          />



          <ListBox

          title="📄 Resume Changes"

          items={result.resumeChanges}

          />



        </div>

        }



      </div>


    </main>

  );

}





function SkillBox({

title,
items,
color

}:{

title:string;
items:string[];
color:"green"|"red";

}){


return (

<div className="border rounded-2xl p-6">

<h2 className="font-bold text-xl mb-4">
{title}
</h2>


<div className="flex flex-wrap gap-2">


{
items?.map((item)=>(

<span

key={item}

className={`
px-3
py-2
rounded-full
text-sm

${
color==="green"
?
"bg-green-100 text-green-700"
:
"bg-red-100 text-red-700"
}

`}

>

{item}

</span>


))

}


</div>


</div>

);


}




function ListBox({

title,
items

}:{

title:string;
items:string[];

}){


return (

<div className="
border
rounded-2xl
p-6
">


<h2 className="
font-bold
text-xl
mb-4
">

{title}

</h2>


<ul className="
list-disc
ml-5
space-y-2
">


{
items?.map((item)=>(

<li key={item}>
{item}
</li>

))

}


</ul>


</div>

);


}
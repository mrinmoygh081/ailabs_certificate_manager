"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import { checkTypeArr } from "../../../utils/smallFun";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [topics, setTopics] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const initialValue = {
    year: "",
    topic: "",
    name: "",
  };
  const [form, setForm] = useState(initialValue);

  useEffect(() => {
    fetch("/api/getFolders")
      .then((res) => res.json())
      .then((data) => setYears(data));
  }, []);

  useEffect(() => {
    (() => {
      if (form.year) {
        fetch(`/api/getFolders?year=${form.year}`)
          .then((res) => res.json())
          .then((data) => setTopics(data));
      }
    })();
  }, [form.year]);

  const gobackHandler = () => {
    setForm(initialValue);
    setPdfs([]);
    setTopics([]);
    setYears([]);
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    const { year, topic, name } = form;
    if (year && topic && name) {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/getFolders?year=${year}&topic=${topic}&name=${name}`);
        const data = await res.json();
        if (checkTypeArr(data)) {
          setPdfs(data);
        } else {
          swal({
            title: "Certificate Not Found.",
            text: "Your certificate is still not generated yet.",
            icon: "warning",
          });
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      swal({
        title: "All fields are required.",
        text: "Please fill all the required fields!",
        icon: "error",
        dangerMode: true,
      });
    }
  };

  return (
    <>
      {/* PDF list */}
      {pdfs.length > 0 ? (
        <div className="max-w-[500px] mx-auto my-6">
          <h2 className="text-lg font-semibold mb-2">Congratulations!</h2>
          <p>A few certificates have been found under your name. Please review them to confirm they belong to you.</p>
          {pdfs.map((pdf, i) => (
            <div key={i} className="flex justify-between border-1 p-2 rounded">
              <p>{pdf}</p>
              <a href={`/api/certificates/${form.year}/${form.topic}/${pdf}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" key={i}>
                Click Here
              </a>
            </div>
          ))}
          <div className="my-2">
            <button className="cursor-pointer underline py-2 rounded-xl transition inline-block" onClick={gobackHandler}>
              Go Back
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image src={"/logo.png"} alt="Logo" width={200} height={100} priority />
            </div>

            {/* Form */}
            <form className="space-y-4">
              <div className="w-100">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none"
                  name="year"
                  value={form?.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                >
                  <option value={""}>Choose year</option>
                  {years.map((item, i) => (
                    <option value={item} key={i}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-100">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Topics
                </label>
                <select
                  className={
                    topics.length === 0
                      ? "disabled w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none"
                      : "w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none"
                  }
                  name="topic"
                  value={form?.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  disabled={topics.length === 0 ? true : false}
                >
                  <option value={""}>Choose topic</option>
                  {topics.map((item, i) => (
                    <option value={item} key={i}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none"
                  value={form?.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                onClick={handleCheck}
                disabled={isLoading}
              >
                Check
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;

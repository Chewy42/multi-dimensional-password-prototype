import {
  AiOutlineLock,
  AiOutlineMail,
  AiOutlineUpload,
  AiOutlineUser,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineArrowDown,
} from "react-icons/ai";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Lottie from "react-lottie";
import AddAnim from "./Anims/add.json";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

const SignUpP2 = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordSequence, setPasswordSequence] = useState([]);
  const [password, setPassword] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addAnimationRef = useRef(null);

  const addAnimOptions = {
    loop: false,
    autoplay: false,
    animationData: AddAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleAddToSequence = (type) => {
    setShowAddMenu(false);
    const newInput = { type, id: `${type}-${Date.now()}` };
    setPasswordSequence([...passwordSequence, newInput]);
  };

  const handleInputChange = (index, value) => {
    const updatedSequence = [...passwordSequence];
    updatedSequence[index].value = value;
    setPasswordSequence(updatedSequence);
  };

  const handleAddClicked = (e) => {
    e.preventDefault();
    setShowAddMenu(true);
  };

  const handleAddAnimation = () => {
    addAnimationRef.current.goToAndPlay(0, true);
  };

  const handleDeleteSequence = (index) => {
    const newSequence = [...passwordSequence];
    newSequence.splice(index, 1);
    setPasswordSequence(newSequence);
  };

  const moveItem = (startIndex, endIndex) => {
    const result = Array.from(passwordSequence);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setPasswordSequence(result);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };


  const handleSignup = async (event) => {
    event.preventDefault();
    let concatenatedSequence = "";

    const readFileAsBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    for (const element of passwordSequence) {
      if (element.type === "text" && element.value) {
        concatenatedSequence += element.value;
      } else if (element.type === "file" && element.value) {
        try {
          const base64String = await readFileAsBase64(element.value);
          concatenatedSequence += base64String;
        } catch (error) {
          console.error("Error reading file:", error);
          return;
        }
      }
    }

    setPassword(concatenatedSequence);
    let result;
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Password: ", concatenatedSequence);

    try {
      result = await axios.post("http://localhost:3001/api/auth/signup", {
        name: name,
        email: email,
        password: concatenatedSequence,
      });
    } catch (error) {
      setErrorMessage("An error occurred during signup. Please try again.");
      console.error(`Error: ${error}`);
    }
    console.log(result);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const startIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    moveItem(startIndex, index);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      passwordSequence,
      result.source.index,
      result.destination.index
    );
    setPasswordSequence(items);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar signup={true} />
      {/* CONTAINER THAT CENTERS SIGNUP CONTAINER */}
      <main className="flex-grow bg-[#f0f4f9] relative flex flex-col justify-center align-top">
        {/* SIGNUP CONTAINER */}
        <div className="mx-auto mt-[150px] mb-auto py-[36px] w-full sm:w-[50%] bg-white rounded-[28px] border-2">
          {/* Error Message Display */}
          {/* {errorMessage && (
            <div className="px-4 py-2 bg-red-500 text-white text-sm rounded-md absolute top-20 left-1/2 transform -translate-x-1/2">
              {errorMessage}
            </div>
          )} */}
          <h2 className="text-3xl font-bold text-center text-primary mb-6 select-none">
          Sign Up<br />Prototype 2
          </h2>

          <form onSubmit={handleSignup}>
            <div className="relative w-[50%] mx-auto">
              <label
                htmlFor="name"
                className="block text-primary font-semibold mb-2 select-none"
              >
                First Name:
              </label>

              <input
                type="text"
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              />

              <AiOutlineUser className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="email"
                className="block text-primary font-semibold mb-2 select-none"
              >
                Email:
              </label>

              <input
                type="email"
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              />
              <AiOutlineMail className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>
            <p className="block text-primary font-semibold select-none mb-2 relative w-[50%] mx-auto">
              Password Sequence:
            </p>
            {/* Password Sequence Section */}

            <div className="flex flex-col justify-center align-middle px-4">
              {passwordSequence.map((input, index) => (
                <React.Fragment key={input.id}>
                  <div
                    key={input.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", index)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const startIndex = parseInt(
                        e.dataTransfer.getData("text/plain"),
                        10
                      );
                      moveItem(startIndex, index);
                    }}
                    className="relative flex flex-col items-center w-full md:w-1/2 p-2 border rounded-lg shadow-sm my-4 mx-auto"
                  >
                    <button
                      onClick={() => handleDeleteSequence(index)}
                      className="absolute top-0 left-0 m-2 text-red-500 hover:text-red-700"
                    >
                      <AiOutlineClose className="w-6 h-6" />
                    </button>
                    <label
                      htmlFor={`sequence${index}`}
                      className="block text-primary font-semibold mb-2 select-none"
                    >
                      Sequence Password {index + 1}
                    </label>
                    {/* Conditional rendering based on input type */}
                    <div className="relative border rounded-lg shadow-sm w-full">
                      <AiOutlineLock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                      {/* Conditional rendering based on input type */}
                      {input.type === "text" ? (
                        <input
                          type="text"
                          id={`sequence${index}`}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          className="pl-10 pr-3 py-2 w-full border rounded focus:outline-none focus:border-primary"
                          value={input.value || ""}
                        />
                      ) : (
                        <>
                          <AiOutlineUpload className="absolute top-3 left-10 w-5 h-5 text-gray-400" />
                          <input
                            type="file"
                            id={`sequence${index}`}
                            onChange={(e) =>
                              handleInputChange(index, e.target.files[0])
                            }
                            className="pl-16 pr-3 py-2 w-full opacity-0 absolute inset-0 z-10 cursor-pointer"
                          />
                          <div className="pl-16 pr-3 py-2 w-full relative z-0">
                            <span className="text-gray-500 font-semibold">
                              {input.value ? input.value.name : "Upload File"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {index < passwordSequence.length - 1 && (
                    <AiOutlineArrowDown className="w-6 h-6 mx-auto my-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Add More Password Elements Button */}
            {passwordSequence.length < 4 && (
              <div className="flex justify-center w-full px-4 pb-2 transition-all ease-linear duration-300">
                <button
                  onClick={handleAddClicked}
                  className={`flex justify-center items-center w-[50%] h-10 rounded-lg transition duration-300 ease-in-out bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold`}
                >
                  {/* Lottie animation integration for a smoother interaction */}
                  <Lottie
                    ref={addAnimationRef}
                    options={addAnimOptions}
                    height={40}
                    width={40}
                    onClick={() => handleAddAnimation()}
                  />
                </button>
              </div>
            )}

            {/* Modal Presentation */}
            {showAddMenu && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                  <button
                    onClick={() => setShowAddMenu(false)}
                    className="text-gray-400 hover:text-gray-500 absolute top-4 right-4 bg-transparent rounded-lg text-sm p-2 inline-flex items-center focus:outline-none"
                  >
                    <AiOutlineClose className="w-5 h-5" />
                  </button>
                  <div className="px-6 py-4">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Add Password Element
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Choose the type of password element you want to add to
                        your sequence.
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="flex flex-col md:flex-row md:space-x-4">
                      <button
                        type="button"
                        onClick={() => handleAddToSequence("text")}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:text-sm mb-2 md:mb-0"
                      >
                        <AiOutlineLock className="mr-2 -ml-1 w-5 h-5" />
                        Add Text Password
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddToSequence("file")}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:text-sm"
                      >
                        <AiOutlineUpload className="mr-2 -ml-1 w-5 h-5" />
                        Add File Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col justfiy-center align-middle w-[50%] mx-auto">
              <span className="relative select-none mr-auto">
                Already registered? <br />
                <Link to="/signin" className="underline text-blue-600">
                  Click here to sign in.
                </Link>
              </span>

              <button
                type="submit"
                className="select-none bg-accent hover:scale-[103%] transition-all ease-linear duration-200 text-black hover:font-bold px-6 py-3 mt-4 rounded-md shadow-md w-[100%] mx-auto"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignUpP2;

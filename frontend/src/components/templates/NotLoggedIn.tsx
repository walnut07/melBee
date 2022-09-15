import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { EmailForm } from "./Interfaces";
import axios, { AxiosResponse, AxiosError } from "axios";
import Login from "./Login";
import Signup from "./Signup";

const NotLoggedIn: React.FC = () => {
    const BASE_URL = process.env.REACT_APP_PUBLIC_URL || "http://localhost:8000";
    const [isUserSignnedUP, setisUserSignnedUP] = useState(false);
    const [isEmailSubmitted, setisEmailSubmitted] = useState(false);
  
    const [email, setEmail] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    };
  
    const handleSubmit = () => {
      const form: EmailForm | null = document.getElementById("mailForm");
      const email: string = form!["email_signup"]!.value;
  
      axios({
        method: "post",
        url: `${BASE_URL}/user/check`,
        data: {
          email: email,
        },
      })
        .then((res: AxiosResponse) => {
          // TODO: Show something when successfully singed up
          console.log(res.data);
          setisEmailSubmitted(true);
          if (res.data["isUserSignnedUp"] === true) {
            setisUserSignnedUP(true);
          } else {
            setisUserSignnedUP(false);
          }
        })
        .catch((err: AxiosError<{ error: string }>) => {
          // TODO: Show something when error caused
          console.log(err.response!.data);
        });
    };

    return (
        <div>
            <h1>melBeeはログインされた方のみご利用になれます。</h1>
            <div className="flex">
              <p className="mb-3 text-gray-500">
                ログインまたは無料で新規登録
              </p>
            </div>
            <div className="contentR_top lg:flex lg:justify-center lg:items-center">
            <div>
              <form id="mailForm">
                {!isEmailSubmitted ? (
                  <>
                    <div className="relative">
                      <input
                        type="mail"
                        name=""
                        value={email}
                        className="inputArea bg-gray-100 border-gray rounded lg:w-96"
                        onChange={(e) => handleChange(e)}
                        placeholder="youremail@example.com"
                        id="email_signup"
                      />
                      {/* <input
                      type="button"
                      value="送信する"
                      onClick={handleSubmit}
                    ></input> */}
                      <button
                        type="button"
                        className="lg:absolute lg:top-1.5 submitBtn"
                        onClick={handleSubmit}
                      >
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="bg-yellow-300 p-3 rounded-3xl text-white"
                        />
                      </button>
                    </div>
                  </>
                ) : null}
              </form>
            </div>
            {isUserSignnedUP && isEmailSubmitted && <Login email={email} />}
            {isEmailSubmitted && !isUserSignnedUP && <Signup email={email} />}
          </div>
        </div>
    );
};

export default NotLoggedIn;
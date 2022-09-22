import React, { useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type Props = {
  reachLimit: boolean;
};

const PreviewBox: React.FC<Props> = ({ reachLimit }) => {
  const BASE_URL = process.env.REACT_APP_PUBLIC_URL || "http://localhost:8000";
  const navigate = useNavigate();
  const EDIT_PATH = "/user/edit";
  const SEND_PATH = "/user/send";

  const [title, setTitle] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);

  // const addEditedTemplate = () => {
  //   console.log(sessionStorage.melbeeID);
  //   axios({
  //     method: "post",
  //     url: `${BASE_URL}/user/${sessionStorage.melbeeID}/template`,
  //     data: {
  //       title: `Saved Template ${Date().toLocaleString()}`,
  //       thumbnail:
  //         "https://drive.tiny.cloud/1/fl35fbae1uoirilftuwgiaq0j9tyhw36quejctjkra1aeap9/2dee0dc9-0afd-4bf9-a258-559073a64208",
  //       body: localStorage.melBeeTempStoragedraft,
  //     },
  //   })
  //     .then((res: AxiosResponse) => {
  //       // TODO: Show something when successfully singed up
  //       console.log(res.data);
  //     })
  //     .catch((err: AxiosError<{ error: string }>) => {
  //       // TODO: Show something when error caused
  //       window.confirm("何かやばい事が起こりました。");
  //       console.log(err.response!.data);
  //     });
  // };

  // useEffect(() => {
  //   addEditedTemplate();
  // }, []);

  const handleSave = (e: React.ChangeEvent<any>): void => {
    e.preventDefault();
    if (title) {
      axios({
        method: "post",
        url: `${BASE_URL}/user/${sessionStorage.melbeeID}/template`,
        data: {
          title: title,
          thumbnail:
            "https://drive.tiny.cloud/1/fl35fbae1uoirilftuwgiaq0j9tyhw36quejctjkra1aeap9/2dee0dc9-0afd-4bf9-a258-559073a64208",
          body: localStorage.melBeeTempStoragedraft,
        },
      })
        .then((res: AxiosResponse) => {
          // TODO: Show something when successfully singed up
          setSaved(true);
          console.log(res.data);
        })
        .catch((err: AxiosError<{ error: string }>) => {
          // TODO: Show something when error caused
          window.confirm("何かやばい事が起こりました。");
          console.log(err.response!.data);
        });
    } else {
      alert(
        "テンプレートを保存するにはタイトルが必要です。\n タイトルを入力してください。"
      );
    }
  };

  return (
    <div className="w-full px-10">
      <div className="flex justify-end w-11/12 mx-auto mb-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate(EDIT_PATH);
          }}
          className="rounded-xl px-6 py-2 drop-shadow-xl text-lg text-white font-medium bg-orangeGradation mr-4"
        >
          {"編集"}
        </button>
        {!reachLimit ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(SEND_PATH);
            }}
            className="rounded-xl px-6 py-2 drop-shadow-xl text-lg text-white font-medium bg-blueGradation"
          >
            {"送信"}
          </button>
        ) : (
          <h3>申し訳ございません、本日の送信リミットに達しました。</h3>
        )}
      </div>
      <div className="text-left">
        {!saved ? (
          <form onSubmit={handleSave}>
            <label>
              作成テンプレートタイトル
              <input
                type="text"
                placeholder="タイトル（２０文字まで）"
                maxLength={20}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded-lg p-2"
              />
            </label>
            <p className="text-sm attention mt-1 mb-3">
              {/* 個人テンプレートに保存し、編集されたテンプレートを引き続きご利用いただけます。 */}
              ※
              作成したテンプレートは自動保存されるため、引き続きご利用いただけます。
            </p>
            <button className="rounded-xl px-6 py-2 drop-shadow-xl text-lg text-white font-medium bg-orangeGradation">
              保存
            </button>
          </form>
        ) : (
          <div className="text-xl">テンプレートが保存されました。</div>
        )}
      </div>
      <h3 className="mt-8 text-2xl">プレビュー</h3>
      <h5>送信前に内容をご確認ください</h5>
      <br />
      <div
        dangerouslySetInnerHTML={{
          __html: localStorage.melBeeTempStoragedraft,
        }}
      />
    </div>
  );
};

export default PreviewBox;

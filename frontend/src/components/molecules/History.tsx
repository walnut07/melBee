import React from "react";

type Props = {
  history: {
    date_sent: string;
    recipients: string;
    template: string;
    subject: string;
  };
  i: number;
  viewHistory: boolean[];
  setViewHistory: Function;
};

const History: React.FC<Props> = ({
  history,
  i,
  viewHistory,
  setViewHistory,
}) => {
  const convertDate = (stringDate: string) => {
    const test = new Date(stringDate);
    const year = test.getFullYear();
    const month = test.getMonth() + 1;
    const date = test.getDate();
    const hour = test.getHours();
    const min = test.getMinutes();
    return (
      <span className="font-bold">{`${year}年${month}月${date}日 ${hour}時${min}分`}</span>
    );
  };

  const handleView = (position: number) => {
    const updateView = viewHistory.map((stat, i) =>
      i === position ? !stat : stat
    );
    setViewHistory(updateView);
  };

  const handleClose = (position: number) => {
    const updateView = viewHistory.map((stat, i) =>
      i === position ? !stat : stat
    );
    setViewHistory(updateView);
  };

  return (
    <div key={`history${i}`}>
      {!viewHistory[i] ? (
        <ul className="flex items-center justify-around historyList mb-2 last:mb-0">
          <li className="text-left">
            送信日時: {convertDate(history.date_sent)}
          </li>
          <li className="text-left">
            件名:<span className="font-bold">{history.subject}</span>
          </li>
          <li>
            {" "}
            <button
              onClick={() => handleView(i)}
              className="rounded-xl px-5 py-2 text-white text-sm bg-orangeGradation"
            >
              詳細
            </button>
          </li>
        </ul>
      ) : (
        <div className="">
          <div className="flex justify-between">
            <ul>
              <li className="text-left mb-2">
                <span className="titleHistory">送信日時:</span>
                {convertDate(history.date_sent)}
              </li>
              <li className="text-left mb-2">
                <span className="titleHistory">件名:</span>{" "}
                <span className="font-bold">{history.subject}</span>
              </li>
              <li className="text-left">
                送信先:
                <ul className="flex flex-wrap">
                  {JSON.parse(history.recipients).map(
                    (email: string, i: number) => {
                      return (
                        <li key={`email${i}`} className=" mb-2 ml-2">
                          <p>{email}</p>
                        </li>
                      );
                    }
                  )}
                </ul>
              </li>
            </ul>
            <div className="">
              <div className="overflow-y-scroll templateHistory">
                <div
                  dangerouslySetInnerHTML={{
                    __html: history.template,
                  }}
                  className="block w-full"
                />
              </div>
            </div>
          </div>{" "}
          <button
            onClick={() => handleClose(i)}
            className="rounded-xl px-5 py-2 text-white text-sm text-white bg-red-500 mt-5 mb-3"
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  );
};

export default History;

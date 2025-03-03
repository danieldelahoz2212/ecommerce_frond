import React from "react";

interface NotifiPropos {
  msg: string;
  type: string;
}

export const Notification: React.FC<NotifiPropos> = ({ msg, type }) => {
  return (
    <div className={`d-flex justify-content-center align-items-center`}>
      <div
        className={`p-3 rounded-lg text-black alert alert-${
          type === "success" ? "success" : "danger"
        }`}
      >
        {msg}
      </div>
    </div>
  );
};

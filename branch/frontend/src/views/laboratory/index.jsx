import React, { useEffect } from "react";

import TaskTable from "@inplan/common/TaskTable";

const Laboratory = () => {
  return (
    <div className="page-light">
      <div className="page">
        <TaskTable
          pendingStatus={[1, 5, 6, 7, 8, 9]} // [Created, In progress, In printing, In thermofoming, In cutting, In progress externally]
          finishedStatus={[2, 3]}
        />
      </div>
    </div>
  );
};

export default Laboratory;

import React from "react";

import { useAppContext } from "@inplan/AppContext";

import TaskTable from "@inplan/common/TaskTable";

const DoctorTasks = () => {
  const { practitioner } = useAppContext();
  /* FIXME: filter was a quickfix
     The aligner do not have to be in in status 2
  */
  return (
    <TaskTable
      exclude={["creator", "status"]}
      creator={practitioner.id}
      pendingStatus={[0, 2]}
      finishedStatus={3}
      printingButton={false}
      filter={(x) => x.type === 0}
    />
  );
};

export default DoctorTasks;

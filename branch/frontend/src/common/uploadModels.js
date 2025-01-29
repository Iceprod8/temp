import { NotificationManager } from "react-notifications";
import { backend } from "@inplan/adapters/apiCalls";

// Upload multiple stl files
export default async function uploadModels(
  files,
  setup,
  parameters,
  translation
) {
  // The function is asynchronous, files can be reset during the execution of the function,
  //     so copy the files before proceed
  const cfiles = [...files];
  const cont = [];

  if (files.length < 1) {
    NotificationManager.error(
      translation("messages.cutlines.no_file_selected")
    );
    return [];
  }

  const toobig = cfiles.some((file) => {
    const fileSize = file.size / 1024 / 1024; // MB
    return fileSize > 20;
  });
  if (toobig) {
    NotificationManager.error(
      translation("messages.cutlines.files_size", { size: "20MB" })
    );
    return [];
  }

  for (let fileIndex = 0; fileIndex < cfiles.length; fileIndex += 1) {
    const formdata = new FormData();
    formdata.append("file", cfiles[fileIndex]);

    Object.entries({
      setup_rank: 0,
      type: 0,
      setup_id: setup.id,
      patient: setup.patient,
      ...parameters,
    }).forEach(([key, value]) => {
      formdata.append(key, value);
    });
    const promise = backend.post("models", formdata);

    cont.push(promise);

    promise.then(() => {
      NotificationManager.success(
        translation("messages.cutlines.file_downloaded", {
          file: cfiles[fileIndex].name,
        })
      );
    });
  }

  return Promise.all(cont);
}

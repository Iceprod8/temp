import { NotificationManager } from "react-notifications";

import { backend } from "@inplan/adapters/apiCalls";

// Upload multiple pts files
export default async function uploadcutlines(
  files,
  setup,
  parameters,
  translation
) {
  // The function is asynchronous, files can be reset during the execution of the function,
  //     so copy the files before proceed
  const cfiles = [...files];

  if (files.length < 1) {
    NotificationManager.error(
      translation("messages.cutlines.no_file_selected")
    );
    return [];
  }

  const toobig = cfiles.some((file) => {
    const fileSize = file.size / 1024 / 1024; // MB
    return fileSize > 1;
  });
  if (toobig) {
    NotificationManager.error(
      translation("messages.cutlines.files_size", { size: "1MB" })
    );
    return [];
  }

  const cont = [];

  cfiles.forEach((file) => {
    const formdata = new FormData();
    formdata.append("file", file);

    Object.entries({
      setup_id: setup.id,
      ...parameters,
    }).forEach(([key, value]) => {
      formdata.append(key, value);
    });
    const promise = backend.post("cutlines/existing_pts", formdata);

    cont.push(promise);

    promise.then(() => {
      NotificationManager.success(
        translation("messages.cutlines.file_downloaded", { file: file.name })
      );
    });
  });
  return Promise.all(cont);
}

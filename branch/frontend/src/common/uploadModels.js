import { backend } from "@inplan/adapters/apiCalls";

// Upload multiple stl files
export default async function uploadModels(
  showSnackbar,
  files,
  setup,
  parameters,
  translation,
) {
  // The function is asynchronous, files can be reset during the execution of the function,
  //     so copy the files before proceed
  const cfiles = [...files];
  const cont = [];

  if (files.length < 1) {
    showSnackbar(translation("messages.cutlines.no_file_selected"), "error");
    return [];
  }

  const toobig = cfiles.some((file) => {
    const fileSize = file.size / 1024 / 1024; // MB
    return fileSize > 20;
  });
  if (toobig) {
    showSnackbar(
      translation("messages.cutlines.files_size", { size: "20MB" }),
      "error",
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
      showSnackbar(
        translation("messages.cutlines.file_downloaded", {
          file: cfiles[fileIndex].name,
        }),
        "success",
      );
    });
  }

  return Promise.all(cont);
}

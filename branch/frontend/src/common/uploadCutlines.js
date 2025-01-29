import { backend } from "@inplan/adapters/apiCalls";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

// Upload multiple pts files
export default async function uploadcutlines(
  files,
  setup,
  parameters,
  translation,
) {
  // The function is asynchronous, files can be reset during the execution of the function,
  //     so copy the files before proceed
  const cfiles = [...files];
  const showSnackbar = useSnackbar();

  if (files.length < 1) {
    showSnackbar(translation("messages.cutlines.no_file_selected"), "error");
    return [];
  }

  const toobig = cfiles.some((file) => {
    const fileSize = file.size / 1024 / 1024; // MB
    return fileSize > 1;
  });
  if (toobig) {
    showSnackbar(
      translation("messages.cutlines.files_size", { size: "1MB" }),
      "error",
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
      showSnackbar(
        translation("messages.cutlines.file_downloaded", { file: file.name }),
        "success",
      );
    });
  });
  return Promise.all(cont);
}

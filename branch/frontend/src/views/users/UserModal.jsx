import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@inplan/common/Modal";
import BasicSelect from "@inplan/common/BasicSelect";
import { useAppContext } from "@inplan/AppContext";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

export default function UserModal({
  seletedOffice,
  setSeletedOffice,
  selectedUser,
  setSelectedUser,
  setModal,
  labelColor,
}) {
  const { getUserRights, offices, createUser, updateUser } = useAppContext();
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();

  const title = selectedUser
    ? `${translation("users.form.update")} : ${selectedUser?.username}`
    : `${translation("users.form.create")}`;

  const [username, setUsername] = useState(
    selectedUser && selectedUser.username !== null ? selectedUser.username : "",
  );
  const [firstname, setFirstname] = useState(
    selectedUser && selectedUser.first_name !== null
      ? selectedUser.first_name
      : "",
  );
  const [lastname, setLastname] = useState(
    selectedUser && selectedUser.last_name !== null
      ? selectedUser.last_name
      : "",
  );
  const [email, setEmail] = useState(
    selectedUser && selectedUser.email !== null ? selectedUser.email : "",
  );
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Field errors
  const [usernameError, setUsernameError] = useState([]);
  const [firstnameError, setFirstnameError] = useState([]);
  const [lastnameError, setLastnameError] = useState([]);
  const [emailError, setEmailError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);

  useEffect(() => {
    // If a <user> is selected, it means that the action is going
    // to be an update, so the information of the selected <user>
    // is loaded into the modal.
    if (selectedUser) {
      setSeletedOffice(selectedUser.office);
    }
  }, []);

  const validate_data = (data) => {
    setUsernameError([]);
    setEmailError([]);
    setPasswordError([]);
    const username_pattern = /^[a-zA-Z0-9@.+_-]{1,150}$/;
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    // password_pattern:
    // At least 8 characters. Max 128 characters
    // At least one special character: !@  $%^&*()-_=+[{]}|;:',<.>?
    // At least one number
    // At least one uppercase
    const password_pattern =
      /^(?=.*[!@  # $%^&*()\-_=+[{\]}|;:',<.>?])(?=.*\d)(?=.*[A-Z]).{8,128}$/;
    const result_username = username_pattern.test(data.username);
    const result_email = email_pattern.test(data.email);
    const result_password = password_pattern.test(data.password);
    let ret = true;
    if (result_username === false) {
      setUsernameError((prevItems) => [
        ...prevItems,
        translation("users.form.fields_rules.letters_digits_and_characters"),
      ]);
      ret = false;
    }
    if (result_email === false) {
      setEmailError((prevItems) => [
        ...prevItems,
        translation("users.form.fields_rules.email_is_not_valid"),
      ]);
      ret = false;
    }
    if (!selectedUser && data.password === data.password_confirm) {
      if (result_password === false) {
        setPasswordError([
          translation(
            "users.form.fields_rules.at_least_8_characters_max_128_characters",
          ),
          translation("users.form.fields_rules.at_least_one_special_character"),
          translation("users.form.fields_rules.at_least_one number"),
          translation("users.form.fields_rules.at_least_one_uppercase"),
        ]);
        ret = false;
      }
    } else if (!selectedUser && data.password !== data.password_confirm) {
      setPasswordError([
        translation(
          "users.form.fields_rules.password_and_password_confirmation_do_not_match",
        ),
      ]);
      ret = false;
    }
    return ret;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    Object.assign(data, {
      user_id: selectedUser?.id,
      office_id: seletedOffice?.id,
    });
    if (validate_data(data) === false) {
      return;
    }
    const updatedRights = await getUserRights();
    // UPDATE USER
    if (selectedUser && updatedRights?.to_update_user) {
      const res = await updateUser(selectedUser.id, data);
      if (res !== undefined) {
        showSnackbar(translation("messages.users.user_was_updated"), "success");
        setModal("");
        setSelectedUser(null);
      } else {
        showSnackbar(
          translation("messages.users.invalid_information_provided"),
          "error",
        );
      }
      return;
    }
    // CREATE USER
    if (!selectedUser && updatedRights?.to_create_user) {
      const res = await createUser({}, data);
      if (res !== undefined) {
        showSnackbar(translation("messages.users.user_was_created"), "success");
        setModal("");
      } else {
        showSnackbar(
          translation("messages.users.invalid_information_provided"),
          "error",
        );
      }
      return;
    }
    // NO PERMISSION
    showSnackbar(
      translation(
        "messages.common.you_do_not_have_permission_to_execute_this_action",
      ),
      "error",
    );
    setModal("");
  };
  return (
    <Modal title={title} onClose={setModal}>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="grid">
          <div className="form-group">
            <label style={{ color: labelColor }}>
              {translation("users.form.office")}
            </label>
            {!selectedUser ? (
              <BasicSelect
                value={seletedOffice}
                setValue={setSeletedOffice}
                data-test="selectUser"
                data={{
                  name: "users",
                  label: "Users",
                  choices: offices,
                }}
                styles={{
                  classes: "btn-tertiary",
                  boxStyle: { height: "50px", width: "100%" },
                  fontSettings: { fontSize: "15px" },
                  selectLabel: { color: "var(--color-primary)" },
                }}
              />
            ) : (
              <div>{selectedUser.office?.name}</div>
            )}
          </div>
          <div className="form-group">
            <label style={{ color: labelColor }}>
              {translation("users.form.username")}
            </label>
            <input
              type="text"
              name="username"
              id="username"
              data-test="username"
              onChange={(e) => {
                setUsernameError([]);
                setUsername(e.target.value);
              }}
              value={username}
            />
            <div style={{ color: "FireBrick", marginTop: 5 }}>
              {usernameError.map((error) => (
                <div>{error}</div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label style={{ color: labelColor }}>
              {translation("users.form.first_name")}
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              data-test="first_name"
              onChange={(e) => {
                setFirstnameError([]);
                setFirstname(e.target.value);
              }}
              value={firstname}
            />
            <div style={{ color: "FireBrick", marginTop: 5 }}>
              {firstnameError.map((error) => (
                <div>{error}</div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label style={{ color: labelColor }}>
              {translation("users.form.last_name")}
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              data-test="last_name"
              onChange={(e) => {
                setLastnameError([]);
                setLastname(e.target.value);
              }}
              value={lastname}
            />
            <div style={{ color: "FireBrick", marginTop: 5 }}>
              {lastnameError.map((error) => (
                <div>{error}</div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label style={{ color: labelColor }}>
              {translation("users.form.email")}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              data-test="email"
              onChange={(e) => {
                setEmailError([]);
                setEmail(e.target.value);
              }}
              value={email}
            />
            <div style={{ color: "FireBrick", marginTop: 5 }}>
              {emailError.map((error) => (
                <div>{error}</div>
              ))}
            </div>
          </div>
          {!selectedUser && (
            <div className="form-group">
              <label style={{ color: labelColor }}>
                {translation("users.form.password")}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                data-test="password"
                onChange={(e) => {
                  setPasswordError([]);
                  setPassword(e.target.value);
                }}
                value={password}
              />
              <div style={{ color: "FireBrick", marginTop: 5 }}>
                {passwordError.map((error) => (
                  <div>{error}</div>
                ))}
              </div>
            </div>
          )}
          {!selectedUser && (
            <div className="form-group">
              <label style={{ color: labelColor }}>
                {translation("users.form.password_confirm")}
              </label>
              <input
                type="password"
                name="password_confirm"
                id="password_confirm"
                data-test="password_confirm"
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                }}
                value={passwordConfirm}
              />
            </div>
          )}
          <div className="grid2">
            <button
              className="btn-modal-muted"
              type="button"
              onClick={() => setModal("")}
            >
              {translation("users.buttons.cancel")}
            </button>
            {!selectedUser ? (
              <button
                className="btn-modal-secondary"
                data-test="new_user_submit"
                type="submit"
              >
                {translation("users.buttons.confirm")}
              </button>
            ) : (
              <button
                className="btn-modal-secondary"
                data-test="new_user_submit"
                type="submit"
              >
                {translation("users.buttons.save")}
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}

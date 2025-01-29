import React, { useRef, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CircularProgress } from "@mui/material";
import { Button } from "@mui/material";
import { BsDownload } from "react-icons/bs";

export default function ButtonUploadModelMenu({ setup, uploader }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [params, setParams] = useState([]);
  const [loading, setloading] = useState(false);
  const open = Boolean(anchorEl);
  const ref = useRef();
  const handleClick = (event) => {
    setAnchorEl(event.target);
  };

  const handleClose = (value) => {
    setParams(value);
    setAnchorEl(null);
  };

  const upload = async (files) => {
    setloading(true);
    if (uploader) {
      await uploader(files, setup, params);
    }
    setloading(false);
  };

  return (
    <div>
      <input
        style={{ display: "none" }}
        data-test="hiddenUploadInput"
        type="file"
        multiple
        ref={ref}
        accept=".stl"
        onChange={(e) => {
          try {
            upload(e.target.files);
          } finally {
            e.target.value = null;
          }
        }}
      />

      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        style={{
          cursor: "pointer",
          padding: 8,
          color: "white",
          borderRadius: "500px",
        }}
        onClick={handleClick}
      >
        {loading ? <CircularProgress size={16} /> : <BsDownload size={30} />}
      </Button>

      <Menu
        id="basic-menu"
        data-test="uploadMenu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          data-test="original"
          onClick={() => {
            handleClose({ is_original: true, is_template: false });
            ref.current.click();
          }}
        >
          Original
        </MenuItem>
        <MenuItem
          data-test="template"
          onClick={() => {
            handleClose({ is_original: false, is_template: true });
            ref.current.click();
          }}
        >
          Template
        </MenuItem>
        <MenuItem
          data-test="aligners"
          onClick={() => {
            handleClose({ is_original: false, is_template: false });
            ref.current.click();
          }}
        >
          Aligners
        </MenuItem>
      </Menu>
    </div>
  );
}

import { React, forwardRef } from "react";
import AddBox from "@mui/icons-material/AddBox";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Check from "@mui/icons-material/Check";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Clear from "@mui/icons-material/Clear";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Edit from "@mui/icons-material/Edit";
import FilterList from "@mui/icons-material/FilterList";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import Remove from "@mui/icons-material/Remove";
import Save from "@mui/icons-material/Save";
import SaveAlt from "@mui/icons-material/SaveAlt";
import Search from "@mui/icons-material/Search";
import ViewColumn from "@mui/icons-material/ViewColumn";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import Refresh from "@mui/icons-material/Refresh";

export default function table() {
  function fwd(Comp) {
    return forwardRef((props, ref) => <Comp {...props} ref={ref} />);
  }

  return {
    Add: fwd(AddBox),
    Check: fwd(Check),
    Clear: fwd(Clear),
    Delete: fwd(DeleteOutline),
    DetailPanel: fwd(ChevronRight),
    Edit: fwd(Edit),
    Export: fwd(SaveAlt),
    Filter: fwd(FilterList),
    FirstPage: fwd(FirstPage),
    LastPage: fwd(LastPage),
    LibraryAdd: fwd(LibraryAdd),
    NextPage: fwd(ChevronRight),
    PreviousPage: fwd(ChevronLeft),
    Refresh: fwd(Refresh),
    ResetSearch: fwd(Clear),
    Save: fwd(Save),
    Search: fwd(Search),
    SortArrow: fwd(ArrowDownward),
    Star: fwd(StarRoundedIcon),
    StarBorder: fwd(StarBorderRoundedIcon),
    ThridStateCheck: fwd(Remove),
    ViewColumn: fwd(ViewColumn),
  };
}

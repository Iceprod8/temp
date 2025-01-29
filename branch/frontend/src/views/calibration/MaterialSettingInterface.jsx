import React from "react";
import { backend } from "@inplan/adapters/apiCalls";
import Select from "@mui/material/Select";
import { dict2formdata } from "@inplan/adapters/functions";

const undefinedSheet = {
  id: "0",
  name: "Undefined",
  provider: "Undefined",
  thickness: 0,
};

async function retrieveSetting(settingId) {
  // get on laser setting
  if (settingId !== 0) {
    const response = await backend.get(`sheets/${settingId}/get_setting`);
    if (response.status === 200) {
      return response.data;
    }
  }
  return undefinedSheet;
}

class MaterialSettingInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSheetPower: 0,
      currentSheetDutyCycle: 0,
      currentSheetFrequency: 0,
      currentSheetId: 0,
      currentSettingId: 0,
      sheetList: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeSheet = this.handleChangeSheet.bind(this);
    this.getSheetList = this.getSheetList.bind(this);
    this.changeSelectedSheet = this.changeSelectedSheet.bind(this);
  }

  // Retrieve the offset value right after creation
  async componentDidMount() {
    // this.retrieveSetting();
    this.getSheetList();
  }

  // Method causes to store all the values of the
  // input field in react state single method handle
  // input changes of all the input field using ES6
  // javascript feature computed property names
  handleChange(event) {
    this.setState({
      // Computed property names
      // keys of the objects are computed dynamically
      [event.target.name]: event.target.value,
    });
  }

  // Form submitting logic
  async handleSubmit(event) {
    const {
      currentSheetPower,
      currentSheetDutyCycle,
      currentSheetFrequency,
      currentSettingId,
    } = this.state;

    // prevent default page refresh
    event.preventDefault();
    const content = {
      laser_power: currentSheetPower,
      laser_duty_cycle: currentSheetDutyCycle,
      laser_frequency: currentSheetFrequency,
    };
    const data = dict2formdata(content);
    await backend.patch(`laser_settings/${currentSettingId}`, data);
  }

  async handleChangeSheet(event) {
    await this.changeSelectedSheet(event.target.value);
  }

  async getSheetList() {
    const res = await backend.get("sheets/available");
    if (res.data.length > 0) {
      this.setState({
        sheetList: res.data,
      });
      await this.changeSelectedSheet(res.data[0].id);
    } else {
      this.setState({
        currentSheetId: 0,
        currentSheetPower: 0,
        currentSheetDutyCycle: 0,
        currentSheetFrequency: 0,
        sheetList: [],
      });
    }
  }

  async changeSelectedSheet(newSheetId) {
    const retrievedSetting = await retrieveSetting(newSheetId);
    this.setState({
      currentSheetId: newSheetId,
      currentSheetPower: retrievedSetting.laser_power,
      currentSheetDutyCycle: retrievedSetting.laser_duty_cycle,
      currentSheetFrequency: retrievedSetting.laser_frequency,
      currentSettingId: retrievedSetting.id,
    });
  }

  render() {
    const {
      currentSheetPower,
      currentSheetDutyCycle,
      currentSheetFrequency,
      sheetList,
      currentSheetId,
    } = this.state;
    // const [open, setOpen] = useState(false);

    const sheetOptions = sheetList
      .filter((s) => s.id !== "0")
      .map((s) => ({
        label: s.name,
        value: s.id,
      }));

    return (
      <form onSubmit={this.handleSubmit} style={{ marginTop: "30px" }}>
        <label style={{ fontSize: "2em" }}>
          Réglage de puissance par matériau de plaque
        </label>

        <div style={{ marginTop: "15px" }}>
          <Select
            value={currentSheetId}
            onChange={this.handleChangeSheet}
            size="small"
            sx={{ height: 1 }}
            native
            autoFocus
          >
            {sheetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <label htmlFor="currentSheetPower"> Puissance </label>
          <input
            type="number"
            name="currentSheetPower"
            value={currentSheetPower}
            onChange={this.handleChange}
            min="1"
            max="100"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="currentSheetDutyCycle"> - Cycle </label>
          <input
            type="number"
            name="currentSheetDutyCycle"
            value={currentSheetDutyCycle}
            onChange={this.handleChange}
            min="1"
            max="100"
            style={{ width: "60px" }}
          />
          <label htmlFor="currentSheetFrequency"> - Fréquence </label>
          <input
            type="number"
            name="currentSheetFrequency"
            value={currentSheetFrequency}
            onChange={this.handleChange}
            min="1"
            max="2000"
            style={{ width: "60px" }}
          />
        </div>

        <div>
          <button
            className="btn-table-primary text-center"
            type="button"
            onClick={this.handleSubmit}
            style={{ marginTop: "15px" }}
          >
            Sauvegarde des réglages de materiaux
          </button>
        </div>
      </form>
    );
  }
}

// <div style={styles.actionButton}>
// <Button
//   variant="outlined"
//   size="large"
//   sx={{ ...styles.actionValidate }}
//   endIcon={<MdSend />}
//   disabled={!displayPendingOrders || selectedRows.length === 0}
//   data-test="validate"
//   onClick={() => {
//     validate();
//   }}
// >
//   Validate orders
// </Button>
// </div>
// </div>

export default MaterialSettingInterface;

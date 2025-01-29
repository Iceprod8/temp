import React from "react";
import { inlase } from "@inplan/adapters/inlaseCalls";
import CheckBox from "@inplan/common/CheckBox";
import useToggle from "@inplan/common/useToogle";
import SlotInput from "./SlotInput";

class CalibrationForm extends React.Component {
  constructor(props) {
    super(props);
    const defaultActive = false;
    const defaultPower = 30;
    const defaultDutyCycle = 80;
    const defaultFrequency = 500;
    this.state = {
      slot0Active: defaultActive,
      slot0Power: defaultPower,
      slot0DutyCycle: defaultDutyCycle,
      slot0Frequency: defaultFrequency,
      slot1Active: defaultActive,
      slot1Power: defaultPower,
      slot1DutyCycle: defaultDutyCycle,
      slot1Frequency: defaultFrequency,
      slot2Active: defaultActive,
      slot2Power: defaultPower,
      slot2DutyCycle: defaultDutyCycle,
      slot2Frequency: defaultFrequency,
      slot3Active: defaultActive,
      slot3Power: defaultPower,
      slot3DutyCycle: defaultDutyCycle,
      slot3Frequency: defaultFrequency,
      slot4Active: defaultActive,
      slot4Power: defaultPower,
      slot4DutyCycle: defaultDutyCycle,
      slot4Frequency: defaultFrequency,
      slot5Active: defaultActive,
      slot5Power: defaultPower,
      slot5DutyCycle: defaultDutyCycle,
      slot5Frequency: defaultFrequency,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  handleSubmit(event) {
    const {
      slot0Active,
      slot0Power,
      slot0DutyCycle,
      slot0Frequency,
      slot1Active,
      slot1Power,
      slot1DutyCycle,
      slot1Frequency,
      slot2Active,
      slot2Power,
      slot2DutyCycle,
      slot2Frequency,
      slot3Active,
      slot3Power,
      slot3DutyCycle,
      slot3Frequency,
      slot4Active,
      slot4Power,
      slot4DutyCycle,
      slot4Frequency,
      slot5Active,
      slot5Power,
      slot5DutyCycle,
      slot5Frequency,
    } = this.state;

    const defaultLaserSettings = {
      Frequency: 1000,
      LaserTimeOut: 25,
      VectorSpeed: 4192,
    };

    const CalibrationCutlinePoints = [
      {
        x: 3.8239,
        y: 19.2536,
        z: 10.8145,
        w: 16.2622,
      },
      {
        x: 3.3636,
        y: 19.4151,
        z: 10.7674,
        w: 365.6772,
      },
      {
        x: 3.7937,
        y: 19.2518,
        z: 10.8459,
        w: 365.2297,
      },
    ];

    function createEmptySlot(idInput) {
      return {
        id: idInput,
        Power: 0,
        Modulation: false,
        DutyCycle: 0,
        Frequency: 0,
        LaserTimeOut: 0,
        VectorSpeed: 0,
        points: [],
      };
    }

    let slot0 = createEmptySlot("s0");
    let slot1 = createEmptySlot("s1");
    let slot2 = createEmptySlot("s2");
    let slot3 = createEmptySlot("s3");
    let slot4 = createEmptySlot("s4");
    let slot5 = createEmptySlot("s5");

    // prevent default page refresh
    event.preventDefault();
    if (slot0Active) {
      slot0 = {
        id: "s0",
        Power: parseInt(slot0Power, 10),
        Modulation: true,
        DutyCycle: parseInt(slot0DutyCycle, 10),
        Frequency: parseInt(slot0Frequency, 10),
        LaserTimeOut: defaultLaserSettings.LaserTimeOut,
        VectorSpeed: defaultLaserSettings.VectorSpeed,
        points: CalibrationCutlinePoints,
      };
    }

    if (slot1Active) {
      slot1 = {
        id: "s1",
        Power: parseInt(slot1Power, 10),
        Modulation: true,
        DutyCycle: parseInt(slot1DutyCycle, 10),
        Frequency: parseInt(slot1Frequency, 10),
        LaserTimeOut: defaultLaserSettings.LaserTimeOut,
        VectorSpeed: defaultLaserSettings.VectorSpeed,
        points: CalibrationCutlinePoints,
      };
    }

    if (slot2Active) {
      slot2 = {
        id: "s2",
        Power: parseInt(slot2Power, 10),
        Modulation: true,
        DutyCycle: parseInt(slot2DutyCycle, 10),
        Frequency: parseInt(slot2Frequency, 10),
        LaserTimeOut: defaultLaserSettings.LaserTimeOut,
        VectorSpeed: defaultLaserSettings.VectorSpeed,
        points: CalibrationCutlinePoints,
      };
    }

    if (slot3Active) {
      slot3 = {
        id: "s3",
        Power: parseInt(slot3Power, 10),
        Modulation: true,
        DutyCycle: parseInt(slot3DutyCycle, 10),
        Frequency: parseInt(slot3Frequency, 10),
        LaserTimeOut: defaultLaserSettings.LaserTimeOut,
        VectorSpeed: defaultLaserSettings.VectorSpeed,
        points: CalibrationCutlinePoints,
      };
    }

    if (slot4Active) {
      slot4 = {
        id: "s4",
        Power: parseInt(slot4Power, 10),
        Modulation: true,
        DutyCycle: parseInt(slot4DutyCycle, 10),
        Frequency: parseInt(slot4Frequency, 10),
        LaserTimeOut: defaultLaserSettings.LaserTimeOut,
        VectorSpeed: defaultLaserSettings.VectorSpeed,
        points: CalibrationCutlinePoints,
      };
    }

    if (slot5Active) {
      slot5 = {
        id: "s5",
        Power: parseInt(slot5Power, 10),
        Modulation: true,
        DutyCycle: parseInt(slot5DutyCycle, 10),
        Frequency: parseInt(slot5Frequency, 10),
        LaserTimeOut: defaultLaserSettings.LaserTimeOut,
        VectorSpeed: defaultLaserSettings.VectorSpeed,
        points: CalibrationCutlinePoints,
      };
    }

    const slots = [slot0, slot1, slot2, slot3, slot4, slot5];

    inlase.post("trays", { slots });
  }

  render() {
    const {
      slot0Active,
      slot0Power,
      slot0DutyCycle,
      slot0Frequency,
      slot1Active,
      slot1Power,
      slot1DutyCycle,
      slot1Frequency,
      slot2Active,
      slot2Power,
      slot2DutyCycle,
      slot2Frequency,
      slot3Active,
      slot3Power,
      slot3DutyCycle,
      slot3Frequency,
      slot4Active,
      slot4Power,
      slot4DutyCycle,
      slot4Frequency,
      slot5Active,
      slot5Power,
      slot5DutyCycle,
      slot5Frequency,
    } = this.state;
    const tmpStr = "";
    // const [checked, setChecked] = useToggle(false);

    return (
      <form onSubmit={this.handleSubmit}>
        {/* TODO Create a module for this s*** */}

        <div>
          <label htmlFor="slot0Power"> REGLAGE MATERIAUX </label>
        </div>

        <div>
          <label htmlFor="slot0Power"> Choix de la plaque </label>
          <input
            type="string"
            name="slot0Power"
            value={tmpStr}
            onChange={this.handleChange}
            min="1"
            max="40"
            maxLength="2"
          />
        </div>

        <label htmlFor="slot0Power"> Activée? </label>
        <CheckBox />
        <div>
          <label htmlFor="slot0Power"> Puissance </label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            min="1"
            max="40"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0DutyCycle"> - Cycle </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            min="1"
            max="100"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Frequency"> - Fréquence </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            min="1"
            max="1000"
            style={{ width: "60px" }}
          />
        </div>

        <div>
          <button
            className="btn-secondary rounded"
            type="button"
            onClick={this.handleSubmit}
          >
            Sauvegarde des réglages de materiaux
          </button>
        </div>
        <div>
          <button
            className="btn-secondary rounded"
            type="button"
            onClick={this.handleSubmit}
          >
            Sauvegarde des réglages d offset par slot
          </button>
        </div>

        <div>
          <label htmlFor="slot0Power"> SLOT 1</label>
        </div>

        <div>
          <label htmlFor="slot0Power">Translation X</label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            min="1"
            max="1000"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0DutyCycle">Translation Y </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            min="1"
            max="1000"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Frequency"> Translation Z </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            style={{ width: "60px" }}
            min="1"
            max="1000"
          />
          <label htmlFor="slot0Power">Rotation X</label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            style={{ width: "60px" }}
            min="-360"
            max="360"
            maxLength="2"
          />
          <label htmlFor="slot0DutyCycle">Rotation Y </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            style={{ width: "60px" }}
            min="-360"
            max="360"
          />
          <label htmlFor="slot0Frequency"> Rotation Z </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            style={{ width: "60px" }}
            min="-360"
            max="360"
          />
        </div>

        <div>
          <label htmlFor="slot0Power"> SLOT 3 </label>
        </div>

        <div>
          <label htmlFor="slot0Power">Translation X</label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            min="1"
            max="1000"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0DutyCycle">Translation Y </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            min="1"
            max="1000"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Frequency"> Translation Z </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            min="1"
            max="1000"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Power">Rotation X</label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            min="-360"
            max="360"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0DutyCycle">Rotation Y </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            min="-360"
            max="360"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Frequency"> Rotation Z </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            min="-360"
            max="360"
            style={{ width: "60px" }}
          />
        </div>
        <div>
          <label htmlFor="slot0Power"> SLOT 4 </label>
        </div>

        <div>
          <label htmlFor="slot0Power">Translation X</label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            min="1"
            max="1000"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0DutyCycle">Translation Y </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            min="1"
            max="1000"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Frequency"> Translation Z </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            min="1"
            max="1000"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Power">Rotation X</label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            min="-360"
            max="360"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0DutyCycle">Rotation Y </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            min="-360"
            max="360"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Frequency"> Rotation Z </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            min="-360"
            max="360"
            style={{ width: "60px" }}
          />
        </div>
        <div>
          <label htmlFor="slot0Power"> SLOT 5 </label>
        </div>

        <div>
          <label htmlFor="slot0Power"> Load File</label>
          <input
            type="string"
            name="slot0Power"
            value={tmpStr}
            onChange={this.handleChange}
            min="1"
            max="40"
            maxLength="2"
          />
        </div>

        <div>
          <label htmlFor="slot0Power">Translation X</label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            min="1"
            max="1000"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0DutyCycle">Translation Y </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            min="1"
            max="1000"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Frequency"> Translation Z </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            min="1"
            max="1000"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Power">Rotation X</label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            min="-360"
            max="360"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0DutyCycle">Rotation Y </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            min="-360"
            max="360"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Frequency"> Rotation Z </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            min="-360"
            max="360"
            style={{ width: "60px" }}
          />
        </div>
        <div>
          <label htmlFor="slot0Power"> SLOT 6 </label>
        </div>

        <div>
          <label htmlFor="slot0Power">Translation X</label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            min="1"
            max="1000"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0DutyCycle">Translation Y </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            min="1"
            max="1000"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Frequency"> Translation Z </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            min="1"
            max="1000"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Power">Rotation X</label>
          <input
            type="number"
            name="slot0Power"
            value={slot0Power}
            onChange={this.handleChange}
            min="-360"
            max="360"
            maxLength="2"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0DutyCycle">Rotation Y </label>
          <input
            type="number"
            name="slot0DutyCycle"
            value={slot0DutyCycle}
            onChange={this.handleChange}
            min="-360"
            max="360"
            style={{ width: "60px" }}
          />
          <label htmlFor="slot0Frequency"> Rotation Z </label>
          <input
            type="number"
            name="slot0Frequency"
            value={slot0Frequency}
            onChange={this.handleChange}
            min="-360"
            max="360"
            style={{ width: "60px" }}
          />
        </div>
      </form>
    );
  }
}

export default CalibrationForm;

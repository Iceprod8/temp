import React from "react";
import { inlase } from "@inplan/adapters/inlaseCalls";
import { backend } from "@inplan/adapters/apiCalls";
import SlotInput from "./SlotInput";

function points_from_text(text) {
  const points = text
    .split("\n")
    .splice(1)
    .map((l) => l.split(/\s+/).map((v) => parseFloat(v)))
    .filter((l) => l.length === 4);

  return points;
}

async function fileToPoints(file) {
  let points = [];

  if (file) {
    const reader = new FileReader();
    reader.readAsText(file);

    // Use async/await to wait for the file to be loaded
    await new Promise((resolve, reject) => {
      reader.onload = () => {
        points = points_from_text(reader.result);
        resolve();
      };
      reader.onerror = reject;
    });
  }

  return points;
}

class CalibrationCut extends React.Component {
  constructor(props) {
    super(props);
    const defaultActive = false;
    const defaultPower = 30;
    const defaultDutyCycle = 80;
    const defaultFrequency = 500;
    const defaultVectorSpeed = 4192;

    // Like a for loop 0 to 5
    const initialState = [...Array(6)]
      .map((_, i) => ({
        [`slot${i}Active`]: defaultActive,
        [`slot${i}Power`]: defaultPower,
        [`slot${i}DutyCycle`]: defaultDutyCycle,
        [`slot${i}Frequency`]: defaultFrequency,
        [`slot${i}VectorSpeed`]: defaultVectorSpeed,
        [`slot${i}File`]: null,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    this.state = initialState;
    this.state.applyOffset = true;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Method causes to store all the values of the
  // input field in react state single method handle
  // input changes of all the input field using ES6
  // javascript feature computed property names
  // keys of the objects are computed dynamically
  handleChange(event) {
    const { name, value, type, checked, files } = event.target;

    if (type === "checkbox") {
      this.setState({ [name]: checked });
    } else if (type === "file") {
      this.setState({
        [name]: files[0],
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  }

  // Form submitting logic
  async handleSubmit(event) {
    // prevent default page refresh
    event.preventDefault();

    const { ...localState } = this.state;

    const defaultLaserTimeout = 35;

    // preparation of the inlase tray
    const slot_list = [];

    // Loop through slots 0 to 5
    for (let i = 0; i < 6; i += 1) {
      // Destructure the properties from the slots object for clarity
      const isActive = localState[`slot${i}Active`];
      const power = localState[`slot${i}Power`];
      const dutyCycle = localState[`slot${i}DutyCycle`];
      const frequency = localState[`slot${i}Frequency`];
      const vectorSpeed = localState[`slot${i}VectorSpeed`];
      const file = localState[`slot${i}File`];

      // Check if the slot has to be cut
      // If it is inactive, left empty point list so the bridge will skip this slot
      let point_list = [];
      if (isActive) {
        // eslint-disable-next-line no-await-in-loop
        point_list = await fileToPoints(file);
      }

      // Create an object with the properties of this specific slot
      const slotObject = {
        id: `s${i}`,
        Power: parseInt(power, 10),
        Modulation: true,
        DutyCycle: parseInt(dutyCycle, 10),
        Frequency: parseInt(frequency, 10),
        LaserTimeOut: defaultLaserTimeout,
        VectorSpeed: parseInt(vectorSpeed, 10),
        points: point_list.map((p) => ({
          x: p[0],
          y: p[1],
          z: p[2],
          w: p[3],
        })),
      };

      // add the final slot content to the tray
      slot_list.push(slotObject);
    }

    let trayJson = { slots: slot_list };

    //  modify the tray to apply slot specific offsets
    if (localState.applyOffset) {
      const updatedTrayResponse = await backend.post(
        "machines/transform_json",
        trayJson
      );
      trayJson = updatedTrayResponse.data;
    }

    // Send the tray to inlase
    await inlase.post("trays", trayJson);
  }

  render() {
    const { ...localState } = this.state;

    const slotInputs = [...Array(6).keys()].map((index) => (
      <SlotInput
        key={index}
        index={index}
        laserPowerValue={localState[`slot${index}Power`]}
        dutyCycleValue={localState[`slot${index}DutyCycle`]}
        frequencyValue={localState[`slot${index}Frequency`]}
        vectorSpeedValue={localState[`slot${index}VectorSpeed`]}
        fileValue={localState[`slot${index}File`]}
        activeValue={localState[`slot${index}Active`]}
        onChangeAction={this.handleChange}
      />
    ));

    return (
      <form onSubmit={this.handleSubmit} style={{ marginTop: "30px" }}>
        <label style={{ fontSize: "2em" }}>Découpe directe</label>

        {slotInputs}

        <div>
          <button
            className="btn-table-primary text-center"
            type="button"
            onClick={this.handleSubmit}
            style={{ marginTop: "15px" }}
          >
            Calibration - découpe InLase de tous les slots sélectionnés
          </button>
          <label> Apply InLase slot specific offsets ? </label>
          <input
            type="checkbox"
            name="applyOffset"
            checked={localState.applyOffset}
            onChange={this.handleChange}
          />
        </div>
      </form>
    );
  }
}

export default CalibrationCut;

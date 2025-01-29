import React from "react";
import { backend } from "@inplan/adapters/apiCalls";
import SlotOffsetInterface from "./SlotOffsetInterface";

class InlaseOffsetInterface extends React.Component {
  constructor(props) {
    super(props);

    const defaultState = {
      translationX: 0,
      translationY: 0,
      translationZ: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
    };

    const state = {};

    for (let i = 0; i < 6; i += 1) {
      state[`slot${i}TranslationX`] = defaultState.translationX;
      state[`slot${i}TranslationY`] = defaultState.translationY;
      state[`slot${i}TranslationZ`] = defaultState.translationZ;
      state[`slot${i}RotationX`] = defaultState.rotationX;
      state[`slot${i}RotationY`] = defaultState.rotationY;
      state[`slot${i}RotationZ`] = defaultState.rotationZ;
    }

    this.state = state;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Retrieve the offset value right after creation
  async componentDidMount() {
    this.retrieveOffsets();
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
    event.preventDefault();

    const data = {};
    for (let i = 0; i < 6; i += 1) {
      const {
        [`slot${i}TranslationX`]: transX,
        [`slot${i}TranslationY`]: transY,
        [`slot${i}TranslationZ`]: transZ,
      } = this.state;
      const {
        [`slot${i}RotationX`]: rotX,
        [`slot${i}RotationY`]: rotY,
        [`slot${i}RotationZ`]: rotZ,
      } = this.state;

      data[`slot${i + 1}_offsetx`] = transX;
      data[`slot${i + 1}_offsety`] = transY;
      data[`slot${i + 1}_offsetz`] = transZ;
      data[`slot${i + 1}_rot_x`] = rotX;
      data[`slot${i + 1}_rot_y`] = rotY;
      data[`slot${i + 1}_rot_z`] = rotZ;
    }

    try {
      const response = await backend.post(`machines/set_offsets`, data);
    } catch (error) {
      // Todo error message
    }
  }

  async retrieveOffsets() {
    const response = await backend.get(`machines/get_offsets`);

    if (response.status === 200) {
      const currentOffsets = response.data;
      for (let i = 0; i < 6; i += 1) {
        // The intern logic is using 0 as first slot
        // While in backend message, it starts at 1
        const j = i + 1;

        const transValueX = parseFloat(currentOffsets[`slot${j}_offsetx`]);
        const transValueY = parseFloat(currentOffsets[`slot${j}_offsety`]);
        const transValueZ = parseFloat(currentOffsets[`slot${j}_offsetz`]);
        const rotaValueX = parseFloat(currentOffsets[`slot${j}_rot_x`]);
        const rotaValueY = parseFloat(currentOffsets[`slot${j}_rot_y`]);
        const rotaValueZ = parseFloat(currentOffsets[`slot${j}_rot_z`]);

        this.setState({
          [`slot${i}TranslationX`]: transValueX,
          [`slot${i}TranslationY`]: transValueY,
          [`slot${i}TranslationZ`]: transValueZ,
          [`slot${i}RotationX`]: rotaValueX,
          [`slot${i}RotationY`]: rotaValueY,
          [`slot${i}RotationZ`]: rotaValueZ,
        });
      }
    }
  }

  render() {
    const {
      slot0TranslationX,
      slot0TranslationY,
      slot0TranslationZ,
      slot0RotationX,
      slot0RotationY,
      slot0RotationZ,
      slot1TranslationX,
      slot1TranslationY,
      slot1TranslationZ,
      slot1RotationX,
      slot1RotationY,
      slot1RotationZ,
      slot2TranslationX,
      slot2TranslationY,
      slot2TranslationZ,
      slot2RotationX,
      slot2RotationY,
      slot2RotationZ,
      slot3TranslationX,
      slot3TranslationY,
      slot3TranslationZ,
      slot3RotationX,
      slot3RotationY,
      slot3RotationZ,
      slot4TranslationX,
      slot4TranslationY,
      slot4TranslationZ,
      slot4RotationX,
      slot4RotationY,
      slot4RotationZ,
      slot5TranslationX,
      slot5TranslationY,
      slot5TranslationZ,
      slot5RotationX,
      slot5RotationY,
      slot5RotationZ,
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit} style={{ marginTop: "30px" }}>
        <label style={{ fontSize: "2em" }}>Réglages des offsets inlase</label>
        <div>
          <SlotOffsetInterface
            index={0}
            xTranslationValue={slot0TranslationX}
            yTranslationValue={slot0TranslationY}
            zTranslationValue={slot0TranslationZ}
            xRotationValue={slot0RotationX}
            yRotationValue={slot0RotationY}
            zRotationValue={slot0RotationZ}
            onChangeAction={this.handleChange}
          />

          <SlotOffsetInterface
            index={1}
            xTranslationValue={slot1TranslationX}
            yTranslationValue={slot1TranslationY}
            zTranslationValue={slot1TranslationZ}
            xRotationValue={slot1RotationX}
            yRotationValue={slot1RotationY}
            zRotationValue={slot1RotationZ}
            onChangeAction={this.handleChange}
          />

          <SlotOffsetInterface
            index={2}
            xTranslationValue={slot2TranslationX}
            yTranslationValue={slot2TranslationY}
            zTranslationValue={slot2TranslationZ}
            xRotationValue={slot2RotationX}
            yRotationValue={slot2RotationY}
            zRotationValue={slot2RotationZ}
            onChangeAction={this.handleChange}
          />

          <SlotOffsetInterface
            index={3}
            xTranslationValue={slot3TranslationX}
            yTranslationValue={slot3TranslationY}
            zTranslationValue={slot3TranslationZ}
            xRotationValue={slot3RotationX}
            yRotationValue={slot3RotationY}
            zRotationValue={slot3RotationZ}
            onChangeAction={this.handleChange}
          />

          <SlotOffsetInterface
            index={4}
            xTranslationValue={slot4TranslationX}
            yTranslationValue={slot4TranslationY}
            zTranslationValue={slot4TranslationZ}
            xRotationValue={slot4RotationX}
            yRotationValue={slot4RotationY}
            zRotationValue={slot4RotationZ}
            onChangeAction={this.handleChange}
          />

          <SlotOffsetInterface
            index={5}
            xTranslationValue={slot5TranslationX}
            yTranslationValue={slot5TranslationY}
            zTranslationValue={slot5TranslationZ}
            xRotationValue={slot5RotationX}
            yRotationValue={slot5RotationY}
            zRotationValue={slot5RotationZ}
            onChangeAction={this.handleChange}
          />

          <button
            className="btn-table-primary text-center"
            type="button"
            onClick={this.handleSubmit}
            style={{ marginTop: "15px" }}
          >
            Sauvegarde des offsets par slot
          </button>
        </div>
      </form>
    );
  }
}

export default InlaseOffsetInterface;

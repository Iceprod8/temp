import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";

const ProducerParameters = ({ idValuesProducers, setIdValuesProducers }) => {
  const { t: translation } = useTranslation();
  const [producerList, setProducerList] = useState([]);
  const handleChange = (key) => {
    // Create a new object with the updated value
    const updatedValues = { ...idValuesProducers };
    updatedValues[key] = 1 - (updatedValues[key] || 0); // Toggle between 0 and 1
    setIdValuesProducers(updatedValues);
  };

  const getProducerList = async () => {
    let retrievedProducerList = [];
    const { data: office } = await backend.get("offices/current");
    if (office) {
      retrievedProducerList = office.producer_list;
    }
    const { data: res } = await backend.get("producers");
    if (res?.results) {
      setProducerList(res?.results);
    }
    const producerSetInit = {};
    for (let i = 0; i < retrievedProducerList?.length; i += 1) {
      producerSetInit[retrievedProducerList[i]] = 1;
    }
    setIdValuesProducers(producerSetInit);
  };
  useEffect(async () => {
    await getProducerList();
  }, []);

  return (
    <>
      {producerList?.length > 0 && (
        <div>
          <div className="page-head__title">
            <h2 className="h2">
              {translation(
                "navbar.profile.parameters.order_template.settings.producers.title"
              )}
            </h2>
          </div>
          <div style={{ marginBottom: "25px", marginTop: "25px" }}>
            {producerList?.map((producer, index) => (
              <div key={producer.id} style={{ marginBottom: "10px" }}>
                <span style={{ width: "210px", display: "inline-block" }}>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${producer.url}`}
                  >{`${producer.name} :`}</a>
                </span>
                <input
                  type="checkbox"
                  checked={idValuesProducers[producer.id] === 1}
                  onChange={() => handleChange(producer.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProducerParameters;

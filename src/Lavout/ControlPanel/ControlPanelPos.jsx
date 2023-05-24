import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Tabs,
  Button,
  Popconfirm,
  Switch,
  Space,
  Tooltip,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import ConfigContext from "../../context/ModuleConfigContext";
import IsElectronContext from "../../context/IsElectronContext";
import ReloadPageContext from "../../context/ReloadPageContext";
import AddModule from "./AddModule";
import './ModalStyles.css'

const { TabPane } = Tabs;

const ControlPanelPos = ({ handleResetPositions, handleSavePositions }) => {
  const config = useContext(ConfigContext);
  const isElectron = useContext(IsElectronContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localConfigData, setLocalConfigData] = useState(config.data);
  const [selectedModule, setSelectedModule] = useState(null);
  const reloadPage = useContext(ReloadPageContext);

  const fieldLabels = {
    moduleId: "Module ID",
    rows: "Rows",
    cols: "Columns",
    cornerCoordinates: "Corner Coordinates",
    stepSize: "Step Size",
    isWellPlate: "Is WellPlate?",
    isSource: "Is Source?",
    isWaste: "Is Waste?",
    showModule: "Show Module?",
    liquidSources: "Liquid Sources",
    stepSizeh: "Horizontal Step Size",
    stepSizeV: "Vertical Step Size",
  };

  const formatLabel = (label) => {
    return fieldLabels[label] || label;
  };
  const handleActionAfterModalClose = () => {
reloadPage()  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditConfig = () => {
    handleOpenModal();
  };

  const handleSaveConfig = () => {
    console.log("Saving!");
    if (isElectron) {
      const { ipcRenderer } = window.require("electron");
      try {
        ipcRenderer.invoke("edit-config", localConfigData);
        handleCloseModal();
      } catch (error) {
        console.error("Invalid JSON", error);
      }
    } else {
      handleCloseModal();
    }
  };

  const handleAddModule = (type, data) => {
    const newData = { ...localConfigData };
    newData[type] = data;
    setLocalConfigData(newData);
  };

  useEffect(() => {
    setLocalConfigData(config.data);
  }, [config.data]);

  const handleField = (field, initialData) => {
    if (Array.isArray(initialData)) {
      if (typeof initialData[0] === "object") {
        // handle array of objects
        return (
          <Form.List name={field}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    {Object.keys(initialData[0]).map((subfield) => (
                      <Form.Item
                        {...field}
                        name={[field.name, subfield]}
                        fieldKey={[field.fieldKey, subfield]}
                        rules={[{ required: true, message: "Missing field" }]}
                      >
                        <Input placeholder={subfield} />
                      </Form.Item>
                    ))}
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        );
      } else {
        // handle array of values
        return (
          <Form.List name={field}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      rules={[{ required: true, message: "Missing field" }]}
                    >
                      <Input />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        );
      }
    } else if (typeof initialData === "object") {
      // handle object
      return Object.keys(initialData).map((subfield) => (
        <Form.Item label={subfield} name={[field, subfield]}>
          <Input />
        </Form.Item>
      ));
    } else {
      // handle value
      if (typeof initialData === "boolean") {
        return (
          <Form.Item
            valuePropName="checked"
            name={field}
            initialValue={initialData}
            style={{ marginBottom: 8 }}
          >
            <Switch style={{ backgroundColor: "lightgrey" }} />
          </Form.Item>
        );
      } else {
        return (
          <Form.Item name={field}>
            <Input />
          </Form.Item>
        );
      }
    }
  };

  const getMaxModuleId = () => {
    const moduleIds = Object.keys(localConfigData).map(
      (key) => localConfigData[key].moduleId
    );
    return Math.max(...moduleIds);
  };

  const handleDeleteModule = (key) => {
    // Create a copy of localConfigData
    const updatedConfigData = { ...localConfigData };
    // Remove the module from the copied data
    delete updatedConfigData[key];
    // Update the local state
    setLocalConfigData(updatedConfigData);
  };

  let footerContent = [];

if (selectedModule !== null) {
  footerContent.push(
    <Tooltip title="Please finish creating or cancel your new module">
      <Button 
        onClick={handleCloseModal} 
        disabled={selectedModule !== null}
      >
        Cancel
      </Button>
    </Tooltip>,
    <Tooltip title="Please finish creating or cancel your new module">
      <Button 
        onClick={handleSaveConfig}
        className="my-disabled-btn"
        disabled={true}
      >
        Save
      </Button>
    </Tooltip>
  );
} else {
  footerContent.push(
    <Button 
      onClick={handleCloseModal} 
      disabled={selectedModule !== null}
    >
      Cancel
    </Button>,
    <Button 
      onClick={handleSaveConfig}
      className="my-enabled-btn"
  disabled={false}
  >
      Save
    </Button>
  );
}
  return (
    <aside id="content" className="col-span-3 bg-gray-700 p-4 h-full">
      <div className="flex mx-2 mt-2 rounded-md bg-gray-800 relative tabs"></div>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-white text-2xl mb-4">Position Control</h2>
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={handleResetPositions}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Reset Positions
          </button>
          <button
            onClick={handleSavePositions}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Positions
          </button>
        </div>

        <div className="flex justify-center items-center">
          <button
            onClick={handleEditConfig}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit Config
          </button>
        </div>
      </div>
<Modal
  open={isModalOpen}
  onCancel={handleCloseModal}
  onOk={handleSaveConfig}
  afterClose={handleActionAfterModalClose}
  okText="Save"
  cancelButtonProps={{ disabled: selectedModule !== null }}
  width="90%"
  footer={footerContent}

>

        <Tabs>
          {Object.keys(localConfigData).map((key, index) => (
            <TabPane tab={key} key={key}>
              <Form
                initialValues={{ name: key, ...localConfigData[key] }}
                onValuesChange={(changedValues, allValues) => {
                  const { name, ...rest } = allValues;
                  if (name !== key) {
                    delete localConfigData[key];
                  }
                  localConfigData[name] = rest;
                }}
              >
                <Form.Item label={formatLabel("Module Name")} name="name">
                  <Input />
                </Form.Item>

                {Object.keys(localConfigData[key]).map((field) => (
                  <Form.Item label={formatLabel(field)} name={field}>
                    {handleField(field, localConfigData[key][field])}
                  </Form.Item>
                ))}

                <Popconfirm
                  title="Are you sure you want to delete this module?"
                  onConfirm={() => handleDeleteModule(key)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{
                    type: "primary",
                    style: { backgroundColor: "blue" },
                  }}
                >
                  <Button>Delete Module</Button>
                </Popconfirm>
              </Form>
            </TabPane>
          ))}
          <TabPane tab="Add Module" key="addModule">
            <AddModule
              handleAddModule={handleAddModule}
              formatLabel={formatLabel}
              getMaxModuleId={getMaxModuleId}
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
            />
          </TabPane>
        </Tabs>
      </Modal>
    </aside>
  );
};

export default ControlPanelPos;

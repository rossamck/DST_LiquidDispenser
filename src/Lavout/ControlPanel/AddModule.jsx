import React, { useState, useEffect } from "react";
import { Button, Dropdown, Menu, Form, Input, Switch, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";


const AddModule = ({ handleAddModule, formatLabel, getMaxModuleId, selectedModule, setSelectedModule }) => {

  const [form] = Form.useForm(); // Initialize form



  const liquidSourcesTemplate = [
    {
      color: "bg-green-300",
      index: 1,
      highlightedColor: "bg-green-100"
    },
    {
      color: "bg-lightblue-300",
      index: 2,
      highlightedColor: "bg-lightblue-100"
    },
    {
      color: "bg-red-300",
      index: 3,
      highlightedColor: "bg-red-100"
    },
    {
      color: "bg-teal-300",
      index: 4,
      highlightedColor: "bg-teal-100"
    },
    {
      color: "bg-pink-300",
      index: 5,
      highlightedColor: "bg-pink-100"
    },
    {
      color: "bg-yellow-300",
      index: 6,
      highlightedColor: "bg-yellow-100"
    },
    {
      color: "bg-purple-300",
      index: 7,
      highlightedColor: "bg-purple-100"
    },
    {
      color: "bg-cyan-300",
      index: 8,
      highlightedColor: "bg-cyan-100"
    },
    {
      color: "bg-indigo-300",
      index: 9,
      highlightedColor: "bg-indigo-100"
    },
    {
      color: "bg-orange-300",
      index: 10,
      highlightedColor: "bg-orange-100"
    }
    // Continue for rest of colors
  ];
  
  const [moduleTemplates, setModuleTemplates] = useState({
    "well plate": {
      moduleId: null,
      rows: "8",
      cols: 12,
      cornerCoordinates: {
        0: [190, 625],
        1: [200, 2373],
        2: [1500, 100],
        3: [1500, 1400],
      },
      stepSize: 90,
      isWellPlate: true,
      isSource: false,
      isWaste: false,
      showModule: true,
    },
    "source": {
      moduleId: null,
      rows: 1,
      cols: 2,
      cornerCoordinates: {
        0: [350, 250],
        1: [350, 2000],
        2: [1800, 120],
        3: [1800, 1470],
      },
      stepSizeh: 600,
      stepSizeV: 90,
      isWellPlate: false,
      isSource: true,
      isWaste: false,
      showModule: true,
      liquidSources: [],
    },
    "waste": {
      moduleId: null,
      rows: 2,
      cols: 2,
      cornerCoordinates: {
        0: [190, 630],
        1: [200, 2373],
        2: [1500, 100],
        3: [1500, 1400],
      },
      stepSize: 100,
      isWellPlate: false,
      isSource: false,
      isWaste: true,
      showModule: true,
    },
  });

  useEffect(() => {
    // Reset form whenever selectedModule changes
    form.resetFields();
    // Set form initial values based on the new selected module
    if (selectedModule !== null) {
      form.setFieldsValue(moduleTemplates[selectedModule]);
    }
  }, [selectedModule, form, moduleTemplates]);



  const handleModuleTypeSelect = (type) => {
    setSelectedModule(type);
  };

  const handleAdd = (values) => {
    if (values.isSource) {
      const totalSources = values.rows * values.cols;
      values.liquidSources = liquidSourcesTemplate.slice(0, totalSources);
    }

    let nextModuleId = getMaxModuleId() + 1;
    console.log("Next available moduleId = ", nextModuleId);

    const newModule = { ...moduleTemplates[selectedModule], ...values, moduleId: nextModuleId };

    setModuleTemplates({
      ...moduleTemplates,
      [selectedModule]: newModule,
    });

    console.log("Assigned moduleId = ", newModule.moduleId);
    handleAddModule(values.name, newModule);
    setSelectedModule(null);
  };


  const menu = (
    <Menu onClick={(e) => handleModuleTypeSelect(e.key)}>
      <Menu.Item key="well plate">Well Plate</Menu.Item>
      <Menu.Item key="source">Source</Menu.Item>
      <Menu.Item key="waste">Waste</Menu.Item>
    </Menu>
  );

  const renderField = (field, initialValue) => {
    // Replace the List component with Form.List for liquidSources
    if (field === "liquidSources") {
        // Simply display liquidSources information without the ability to add or remove
        return initialValue.map((source, index) => (
          <div key={index}>Color: {source.color}, Index: {source.index}</div>
        ));
    }  else if (field === "moduleId") {
      return (
        <Tooltip title="ModuleID automatically generated">
          <Form.Item name={field}>
            <Input disabled />
          </Form.Item>
        </Tooltip>
      );
    }
    
    else if (typeof initialValue === "object") {
      return Object.keys(initialValue).map((subField) => (
        <Form.Item label={subField} name={[field, subField]}>
          <Input />
        </Form.Item>
      ));
    } else {
      if (typeof initialValue === 'boolean') {
        return (
          <Form.Item valuePropName="checked" name={field} initialValue={initialValue}>
            <Switch />
          </Form.Item>
        );
      } else {
        return <Form.Item name={field}><Input /></Form.Item>;
      }
    }
  };

  return (
    <>
      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="create-module-btn"
          style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }} // Change to match the blue of the save button
        >
          Add Module
        </Button>
      </Dropdown>
      {selectedModule && (
        <Form form={form} onFinish={handleAdd} style={{ marginTop: "20px" }}>  {/* Add margin-top to add space */}
          <Form.Item label="Module Name" name="name">
            <Input placeholder="Enter module name" />
          </Form.Item>
          {Object.keys(moduleTemplates[selectedModule]).map((key) => (
            <Form.Item
              name={key}
             label={formatLabel(key)}
              initialValue={moduleTemplates[selectedModule][key]}
            >
              {renderField(key, moduleTemplates[selectedModule][key])}
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }} 
            >
              Create
            </Button>
            <Button onClick={() => setSelectedModule(null)}>Cancel</Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default AddModule;
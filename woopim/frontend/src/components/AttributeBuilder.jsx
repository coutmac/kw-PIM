import { useState } from 'react';

function AttributeBuilder({ attributes, setAttributes }) {
  const [newAttr, setNewAttr] = useState({ name: '', value: '' });

  const addAttribute = () => {
    if (newAttr.name && newAttr.value) {
      setAttributes([...attributes, newAttr]);
      setNewAttr({ name: '', value: '' });
    }
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const moveUp = (index) => {
    if (index > 0) {
      const newAttrs = [...attributes];
      [newAttrs[index - 1], newAttrs[index]] = [newAttrs[index], newAttrs[index - 1]];
      setAttributes(newAttrs);
    }
  };

  const moveDown = (index) => {
    if (index < attributes.length - 1) {
      const newAttrs = [...attributes];
      [newAttrs[index], newAttrs[index + 1]] = [newAttrs[index + 1], newAttrs[index]];
      setAttributes(newAttrs);
    }
  };

  const commonAttrs = ['Color', 'Size', 'Material', 'Weight', 'Dimensions'];

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Attributes</h3>
      {attributes.map((attr, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          <button onClick={() => moveUp(index)} disabled={index === 0} className="text-gray-500">↑</button>
          <button onClick={() => moveDown(index)} disabled={index === attributes.length - 1} className="text-gray-500">↓</button>
          <input value={attr.name} onChange={e => {
            const newAttrs = [...attributes];
            newAttrs[index].name = e.target.value;
            setAttributes(newAttrs);
          }} placeholder="Name" className="border p-1 flex-1" />
          <input value={attr.value} onChange={e => {
            const newAttrs = [...attributes];
            newAttrs[index].value = e.target.value;
            setAttributes(newAttrs);
          }} placeholder="Value" className="border p-1 flex-1" />
          <button onClick={() => removeAttribute(index)} className="text-red-500">Remove</button>
        </div>
      ))}
      <div className="flex space-x-2 mb-2">
        <select value={newAttr.name} onChange={e => setNewAttr({ ...newAttr, name: e.target.value })} className="border p-1">
          <option value="">Select or type</option>
          {commonAttrs.map(attr => <option key={attr} value={attr}>{attr}</option>)}
        </select>
        <input placeholder="Custom Name" value={newAttr.name} onChange={e => setNewAttr({ ...newAttr, name: e.target.value })} className="border p-1 flex-1" />
        <input placeholder="Value" value={newAttr.value} onChange={e => setNewAttr({ ...newAttr, value: e.target.value })} className="border p-1 flex-1" />
        <button onClick={addAttribute} className="bg-blue-500 text-white px-2 py-1 rounded">Add</button>
      </div>
    </div>
  );
}

export default AttributeBuilder;
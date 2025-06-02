import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import ConfirmDialog from "./ConfirmDialog";
import axios from "axios";
import AttributeTable from "@/components/AttributeTable";
import ImageGallery from "@/components/ImageGallery";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState("");
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const docRef = doc(db, "events", "data");

  // Load Events from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEvents(data.events || []);
      }
    };
    fetchData();
  }, []);

  // Save Events to Firestore
  useEffect(() => {
    if (events.length > 0) {
      saveData();
    }
  }, [events]);

  const saveData = async () => {
    await setDoc(docRef, { events });
  };

  const addEvent = () => {
    if (newEventName.trim() === "") return;
    const updatedEvents = [...events, { name: newEventName, attributes: [] }];
    setEvents(updatedEvents);
    setNewEventName("");
  };

  const selectEvent = (index) => {
    setSelectedEventIndex(index);
  };

  const goBack = () => {
    setSelectedEventIndex(null);
  };

  const askDeleteEvent = (index) => {
    setConfirmAction(() => () => deleteEvent(index));
    setShowConfirm(true);
  };

  const deleteEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
    setShowConfirm(false);
  };

  return (
    <div className="events-page">
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this event?"
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {selectedEventIndex === null ? (
        <div>
          <h2>Events</h2>
          <div className="event-input">
            <input
              type="text"
              placeholder="Add a new event..."
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
            />
            <button onClick={addEvent}>Add Event</button>
          </div>

          <div className="event-list">
            {events.map((event, index) => (
              <div key={index} className="event-card">
                <span onClick={() => selectEvent(index)}>{event.name}</span>
                <button
                  className="delete-button"
                  onClick={() => askDeleteEvent(index)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EventDetail
          event={events[selectedEventIndex]}
          updateEvent={(updatedAttributes) => {
            const updatedEvents = [...events];
            updatedEvents[selectedEventIndex].attributes = updatedAttributes;
            setEvents(updatedEvents);
          }}
          goBack={goBack}
        />
      )}
    </div>
  );
}

function EventDetail({ event, updateEvent, goBack }) {
  const [attributes, setAttributes] = useState(event.attributes || []);
  const [newAttrName, setNewAttrName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedAttributeIndex, setSelectedAttributeIndex] = useState(null);

  const addAttribute = () => {
    if (newAttrName.trim() === "") return;
    const updated = [
      ...attributes,
      { name: newAttrName, columns: [], rows: [] },
    ];
    setAttributes(updated);
    updateEvent(updated);
    setNewAttrName("");
  };

  const askDeleteAttribute = (index) => {
    setConfirmAction(() => () => deleteAttribute(index));
    setShowConfirm(true);
  };

  const deleteAttribute = (index) => {
    const updated = attributes.filter((_, i) => i !== index);
    setAttributes(updated);
    updateEvent(updated);
    setShowConfirm(false);
  };

  const selectAttribute = (index) => {
    setSelectedAttributeIndex(index);
  };

  return (
    <div>
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this attribute?"
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {selectedAttributeIndex === null ? (
        <div className="attribute-page">
          <button onClick={goBack}  className="back-button">← Back to Events</button>
          <h2>{event.name}</h2>

          <div className="attribute-input">
            <input
              type="text"
              placeholder="Add new attribute..."
              value={newAttrName}
              onChange={(e) => setNewAttrName(e.target.value)}
            />
            <button onClick={addAttribute} className="add-attribute-btn">Add Attribute</button>
          </div>

          <div className="attribute-list">
            {attributes.map((attr, index) => (
              <div key={index} className="attribute-card">
                <span onClick={() => selectAttribute(index)}>{attr.name}</span>
                <button
                   className="delete-button"
                  onClick={() => askDeleteAttribute(index)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AttributeDetail
          attribute={attributes[selectedAttributeIndex]}
          updateAttribute={(updatedAttr) => {
            const updatedAttributes = [...attributes];
            updatedAttributes[selectedAttributeIndex] = updatedAttr;
            setAttributes(updatedAttributes);
            updateEvent(updatedAttributes);
          }}
          goBack={() => setSelectedAttributeIndex(null)}
        />
      )}
    </div>
  );
}

function AttributeDetail({ attribute, updateAttribute, goBack }) {
  const [columns, setColumns] = useState(attribute.columns || []);
  const [rows, setRows] = useState(attribute.rows || []);
  const [gallery, setGallery] = useState(attribute.gallery || []);
  const [newColumn, setNewColumn] = useState("");
  const [modalImage, setModalImage] = useState(null); // For viewing big image

  const CLOUDINARY_UPLOAD_PRESET = "wedding_upload";
  const CLOUDINARY_CLOUD_NAME = "defzpkljn";

  const addRow = () => {
    const freshRow = columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {});
    const updatedRows = [...rows, freshRow];
    setRows(updatedRows);
    updateAttribute({ ...attribute, rows: updatedRows, gallery });
  };

  const addColumn = () => {
    if (newColumn.trim() === "") return;
    const updatedColumns = [...columns, newColumn];
    const updatedRows = rows.map((row) => ({
      ...row,
      [newColumn]: "",
    }));

    setColumns(updatedColumns);
    setRows(updatedRows);
    updateAttribute({
      ...attribute,
      columns: updatedColumns,
      rows: updatedRows,
      gallery,
    });
    setNewColumn("");
  };

  const deleteColumn = (colToDelete) => {
    const updatedColumns = columns.filter((col) => col !== colToDelete);
    const updatedRows = rows.map((row) => {
      const newRow = { ...row };
      delete newRow[colToDelete];
      return newRow;
    });

    setColumns(updatedColumns);
    setRows(updatedRows);
    updateAttribute({
      ...attribute,
      columns: updatedColumns,
      rows: updatedRows,
      gallery,
    });
  };

  const updateCell = (rowIndex, column, value) => {
    const updatedRows = rows.map((row, i) => {
      if (i === rowIndex) {
        return { ...row, [column]: value };
      }
      return row;
    });

    setRows(updatedRows);
    updateAttribute({ ...attribute, rows: updatedRows, gallery });
  };

  const deleteRow = (rowIndex) => {
    const updatedRows = rows.filter((_, i) => i !== rowIndex);
    setRows(updatedRows);
    updateAttribute({ ...attribute, rows: updatedRows, gallery });
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      const updatedGallery = [...gallery, response.data.secure_url];
      setGallery(updatedGallery);
      updateAttribute({ ...attribute, rows, gallery: updatedGallery });
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  const deleteGalleryImage = (index) => {
    const updatedGallery = gallery.filter((_, i) => i !== index);
    setGallery(updatedGallery);
    updateAttribute({ ...attribute, rows, gallery: updatedGallery });
  };

  return (
    <div>
      <button className="back-button" onClick={goBack}>← Back to Attributes</button>
      <h2>{attribute.name}</h2>
<AttributeTable
  columns={columns}
  rows={rows}
  updateCell={updateCell}
  addRow={addRow}
  addColumn={(newCol) => {
    setColumns([...columns, newCol]);
    const updatedRows = rows.map(row => ({ ...row, [newCol]: "" }));
    setRows(updatedRows);
    updateAttribute({ ...attribute, columns: [...columns, newCol], rows: updatedRows, gallery });
  }}
  deleteRow={deleteRow}
  deleteColumn={deleteColumn}
/>

<ImageGallery
  gallery={gallery}
  handleGalleryUpload={handleGalleryUpload}
  deleteGalleryImage={deleteGalleryImage}
/>
      {/* Add Columns */}
      {/* <div className="column-input">
        <input
          type="text"
          placeholder="New column name"
          value={newColumn}
          onChange={(e) => setNewColumn(e.target.value)}
        />
        <button className="add-column-btn"  onClick={addColumn}>Add Column</button>
      </div> */}

      {/* Table
      
      <table className="items-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>
                {col}
                <button
                  onClick={() => deleteColumn(col)}
                  style={{
                    marginLeft: "8px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  title="Delete Column"
                >
                  🗑️
                </button>
              </th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.toLowerCase().includes("link") && row[col] ? (
                    <a
                      href={row[col]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {row[col]}
                    </a>
                  ) : (
                    <input
                      type="text"
                      value={row[col]}
                      onChange={(e) =>
                        updateCell(rowIndex, col, e.target.value)
                      }
                    />
                  )}
                </td>
              ))}
              <td>
                <button onClick={() => deleteRow(rowIndex)}>Delete Row</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-column-btn"  onClick={addRow}>Add Row</button> */}

      {/* Image Gallery */}
     {/* <div className="gallery-section">
  <h3>Image Gallery</h3>

  <div className="file-upload">
    <label htmlFor="fileInput" className="file-upload-label">
      Choose File
    </label>
    <input
      id="fileInput"
      type="file"
      onChange={handleGalleryUpload}
    />
  </div>

  <div className="gallery-grid">
    {gallery.map((imgUrl, index) => (
      <div key={index} className="gallery-item">
        <img
          src={imgUrl}
          alt="Gallery"
          onClick={() => setModalImage(imgUrl)}
        />
        <button
          className="delete-gallery-btn"
          onClick={() => deleteGalleryImage(index)}
        >
          🗑️
        </button>
      </div>
    ))}
  </div>
</div> */}


      {/* Modal */}
      {modalImage && (
        <div className="modal-overlay" onClick={() => setModalImage(null)}>
          <div className="modal-content">
            <img src={modalImage} alt="Full View" />
          </div>
        </div>
      )}
    </div>
  );
}

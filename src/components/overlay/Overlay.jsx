import { useContext } from "react";
import { EditIcon } from "../icons/EditIcon";
import { RotateLeft } from "../icons/RotateLeft";
import { RotateRight } from "../icons/RotateRight";
import { EditContext } from "../../context/EditContext";
import { CloseIcon } from "../icons/CloseIcon";

export const Overlay = () => {
  const { isEditMode, setEditMode, selectedId, setSelectedId, rotate } =
    useContext(EditContext);

  return (
    <div className="overlay">
      {isEditMode && selectedId ? (
        <>
          <RotateLeft onClick={() => rotate("left")} />
          <RotateRight onClick={() => rotate("right")} />
        </>
      ) : null}
      {selectedId ? <CloseIcon onClick={() => setSelectedId(null)} /> : null}
      <EditIcon
        onClick={() => {
          setEditMode((prev) => !prev);
        }}
      />
    </div>
  );
};

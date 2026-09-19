import { useState, type CSSProperties, type FormEvent } from "react";
import useProjectStore from "../../stores/projectStore";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateProjectModal = ({
  isOpen,
  onClose,
  onCreated,
}: CreateProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createNewProject, loading, error } = useProjectStore();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createNewProject(name.trim(), description.trim());
    if (useProjectStore.getState().error) return;

    setName("");
    setDescription("");
    onClose();
    onCreated();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`@keyframes fade{from{opacity:0}to{opacity:1}}@keyframes pop{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}.primary:hover{transform:translateY(-2px);box-shadow:0 12px 24px #6366f14d}.close:hover{background:#eef2ff;color:#4f46e5}.field:focus{outline:none;border-color:#818cf8;box-shadow:0 0 0 4px #818cf826}`}</style>
      <div
        style={styles.overlay}
        role="dialog"
        aria-modal="true"
        aria-labelledby="title"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div style={styles.modal}>
          <button
            className="close"
            style={styles.close}
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <div style={styles.eyebrow}>START SOMETHING NEW</div>
          <h2 id="title" style={styles.title}>
            Create a project
          </h2>
          <p style={styles.copy}>
            Give your project a name and a little context to get your team
            aligned.
          </p>
          <form onSubmit={submit}>
            <label style={styles.label} htmlFor="name">
              Project name
            </label>
            <input
              className="field"
              id="name"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website redesign"
              style={styles.input}
            />
            <label
              style={{ ...styles.label, marginTop: 18 }}
              htmlFor="description"
            >
              Description <span style={styles.optional}>(optional)</span>
            </label>
            <textarea
              className="field"
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you hoping to accomplish?"
              style={{ ...styles.input, resize: "vertical" }}
            />
            <div style={styles.actions}>
              <button type="button" onClick={onClose} style={styles.cancel}>
                Cancel
              </button>
              <button
                className="primary"
                type="submit"
                style={{ ...styles.submit, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create project"} <span>→</span>
              </button>
            </div>
            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#f8fafc,#eef2ff)",
    color: "#172554",
    fontFamily: "Inter,system-ui,sans-serif",
  },
  hero: {
    maxWidth: 700,
    margin: "auto",
    padding: "18vh 24px",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: 30,
    background: "#e0e7ff",
    color: "#4f46e5",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.2,
  },
  heading: {
    margin: "20px 0 12px",
    fontSize: "clamp(38px,6vw,64px)",
    lineHeight: 1.08,
    letterSpacing: -2,
  },
  subtitle: {
    maxWidth: 520,
    margin: "0 auto 30px",
    color: "#64748b",
    fontSize: 17,
    lineHeight: 1.6,
  },
  openButton: {
    border: 0,
    borderRadius: 12,
    padding: "13px 20px",
    background: "#4f46e5",
    color: "white",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all .2s",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    display: "grid",
    placeItems: "center",
    padding: 20,
    background: "#0f172a85",
    backdropFilter: "blur(8px)",
    animation: "fade .25s ease",
  },
  modal: {
    position: "relative",
    width: "100%",
    maxWidth: 470,
    padding: "34px 36px 30px",
    borderRadius: 24,
    background: "white",
    boxShadow: "0 25px 70px #0f172a40",
    animation: "pop .35s cubic-bezier(.2,.8,.2,1)",
  },
  close: {
    position: "absolute",
    top: 18,
    right: 18,
    border: 0,
    borderRadius: 9,
    padding: "4px 9px",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 25,
    cursor: "pointer",
  },
  icon: {
    width: 42,
    height: 42,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: "#eef2ff",
    color: "#6366f1",
    fontSize: 21,
  },
  eyebrow: {
    marginTop: 22,
    color: "#6366f1",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.4,
  },
  title: { margin: "7px 0 10px", fontSize: 30, letterSpacing: -0.8 },
  copy: {
    margin: "0 0 26px",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.55,
  },
  error: {
    margin: "12px 0 0",
    color: "#dc2626",
    fontSize: 13,
    textAlign: "right",
  },
  label: {
    display: "block",
    marginBottom: 8,
    color: "#334155",
    fontSize: 13,
    fontWeight: 700,
  },
  optional: { color: "#94a3b8", fontWeight: 400 },
  input: {
    boxSizing: "border-box",
    width: "100%",
    border: "1px solid #dbe3f0",
    borderRadius: 10,
    padding: "12px 13px",
    background: "#fbfdff",
    color: "#172554",
    font: "inherit",
    fontSize: 14,
    transition: "all .2s",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 28,
  },
  cancel: {
    border: 0,
    padding: "11px 17px",
    background: "transparent",
    color: "#64748b",
    fontWeight: 700,
    cursor: "pointer",
  },
  submit: {
    border: 0,
    borderRadius: 10,
    padding: "11px 18px",
    background: "#4f46e5",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all .2s",
  },
};

export default CreateProjectModal;

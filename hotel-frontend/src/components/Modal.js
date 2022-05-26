import './Modal.css';

const Modal = ({ title, body, onclose }) => {
	return (
		<div className="overlay">
			<article className="modal">
				<div className="modal-head">
					<h3>{title}</h3>
					<button className="modal-exit" onClick={onclose}>
						&times;
					</button>
				</div>
				<div className="modal-body">{body}</div>
			</article>
		</div>
	);
};

export default Modal;

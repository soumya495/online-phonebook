function Modal({ modalOpen, setModalOpen, styleEl, children }) {
  return (
    <div className='modal-wrapper' onClick={() => setModalOpen(false)}>
      <div
        className={`modal-body ${styleEl ?? ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal

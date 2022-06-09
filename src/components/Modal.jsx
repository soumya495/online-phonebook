function Modal({ modalOpen, setModalOpen, children }) {
  return (
    <div className='modal-wrapper' onClick={() => setModalOpen(false)}>
      <div className='modal-body' onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default Modal

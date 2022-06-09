import Navbar from '../Navbar'

function SignUp() {
  return (
    <div className='container'>
      <Navbar />
      <div className='max-width'>
        <div className='title'>Sign Up</div>
        <form action='#'>
          <div className='user-details'>
            <div className='input-box'>
              <span className='details'>Name</span>
              <input type='text' placeholder='Enter Your Name' required />
            </div>
            <div className='input-box'>
              <span className='details'>E-mail</span>
              <input type='email' placeholder='Enter Your email' required />
            </div>

            <div className='input-box'>
              <span className='details'>Password</span>
              <input
                type='password'
                placeholder='Enter Your Password'
                required
              />
            </div>
            <div className='input-box'>
              <span className='details'>Confirm Password</span>
              <input type='password' placeholder='Confirm Password' required />
            </div>
          </div>
          {/* <div className='gender-details'>
            <input type='radio' name='gender' id='dot-1' />
            <input type='radio' name='gender' id='dot-2' />
            <input type='radio' name='gender' id='dot-3' />
            <span className='gender-title'>Gender</span>
            <div className='category'>
              <label htmlFor='dot-1'>
                <span className='dot one' />
                <span className='gender'>Male</span>
              </label>
              <label htmlFor='dot-2'>
                <span className='dot two' />
                <span className='gender'>Female</span>
              </label>
              <label htmlFor='dot-3'>
                <span className='dot three' />
                <span className='gender'>Prefer not to say</span>
              </label>
            </div>
          </div> */}
          <div className='button'>
            <input type='submit' defaultValue='Register' />
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp

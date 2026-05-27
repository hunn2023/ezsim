import { useAuthStore } from '@/stores/authStore'
import { Fragment } from 'react'
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import { TbChevronDown, TbLogout2, TbSettings2, TbUserCircle } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router'

const UserProfile = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const initials =
    user?.name
      .split(' ')
      .slice(-2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() ?? 'A'

  const firstName = user?.name.split(' ').at(-1) ?? 'Admin'

  return (
    <div className="topbar-item nav-user">
      <Dropdown align="end">
        <DropdownToggle as={'a'} className="topbar-link dropdown-toggle drop-arrow-none px-2">
          <div
            className="rounded-circle me-lg-2 d-flex align-items-center justify-content-center bg-primary text-white fw-bold flex-shrink-0"
            style={{ width: 32, height: 32, fontSize: 12 }}>
            {initials}
          </div>
          <div className="d-lg-flex align-items-center gap-1 d-none">
            <h5 className="my-0">{firstName}</h5>
            <TbChevronDown className="align-middle" />
          </div>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <div className="dropdown-header noti-title">
            <h6 className="text-overflow m-0">{user?.name ?? 'Admin'}</h6>
            <small className="text-muted">{user?.email}</small>
          </div>
          <Fragment>
            <DropdownItem as={Link} to="/pages/profile">
              <TbUserCircle className="me-2 fs-17 align-middle" />
              <span className="align-middle">Profile</span>
            </DropdownItem>
            <DropdownItem as={Link} to="/settings">
              <TbSettings2 className="me-2 fs-17 align-middle" />
              <span className="align-middle">Settings</span>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout} className="text-danger fw-semibold" style={{ cursor: 'pointer' }}>
              <TbLogout2 className="me-2 fs-17 align-middle" />
              <span className="align-middle">Đăng xuất</span>
            </DropdownItem>
          </Fragment>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default UserProfile

import { appName, currentYear } from '@/helpers'
import { Container } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <div className="text-center text-md-start text-muted" style={{ fontSize: 13 }}>
          © {currentYear} {appName}
        </div>
      </Container>
    </footer>
  )
}

export default Footer

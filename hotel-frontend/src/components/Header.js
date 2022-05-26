import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
	return (
		<header>
			<nav>
				<ul>
					<li>
						<NavLink
							to="/"
							className={navData => (navData.isActive ? 'active' : '')}
						>
							Rooms
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/reservations"
							className={navData => (navData.isActive ? 'active' : '')}
						>
							Reservations
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;

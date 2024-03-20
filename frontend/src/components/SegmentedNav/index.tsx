import { NavLink } from 'react-router-dom';

import classes from './segmentednav.module.css';

export type SegmentedNavRoutes = {
  to: string;
  label: string;
  end?: boolean;
};

export type SegmentedNavProps = {
  routes: SegmentedNavRoutes[];
};

export function SegmentedNav({ routes }: SegmentedNavProps) {
  return (
    <div className={classes.root}>
      {routes.map((route, index) => (
        <NavLink
          key={index}
          to={route.to}
          end={route.end}
          className={({ isActive }) =>
            ` ${classes.link} ${isActive ? classes.active : classes.inactive}`
          }
        >
          {route.label}
        </NavLink>
      ))}
    </div>
  );
}

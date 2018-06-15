import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from '../styles.scss';
import data from './data';
import RegionShape from '../RegionShape';
import RegionInfo from './RegionInfo';

class MacroMap extends React.PureComponent {
    static propTypes = {
        plan: PropTypes.number,
        kqi: PropTypes.objectOf(PropTypes.number).isRequired,
        padding: PropTypes.number,
        buildLink: PropTypes.func.isRequired,
    };
    static defaultProps = {
        padding: 0,
    };

    state = {
        active: null,
    };

    active = null;

    onMouseEnter = (id) => {
        this.active = id;
        this.setState(state => {
            if (state.active !== this.active) return { active: this.active };
        });
    };
    onMouseLeave = (id) => {
        this.active = null;
        this.setState(state => {
            if (state.active !== this.active) return { active: this.active };
        });
    };

    render() {
        const { active } = this.state;
        const { plan, kqi } = this.props;

        const list = Object.values(data.regions);
        const sortedList = [...list].sort((a, b) => {
            if (a.id === active) return 1;
            if (b.id === active) return -1;
            return a.id - b.id;
        });

        const initialWidth = data.width;
        const initialHeight = data.height;
        const paddingH = this.props.padding;
        const paddingV = paddingH / initialWidth * initialHeight;
        const width = initialWidth + paddingH * 2;
        const height = initialHeight + paddingV * 2;

        return (
            <div className={styles.russianMap}>
                <div className={cn(styles.wrapper, styles.macro)}>
                    <div
                        style={{
                            position: 'static',
                            width: '100%',
                        }}
                    >
                        <div
                            style={{
                                height: 0,
                                overflow: 'hidden',
                                paddingTop: `calc(${height} / ${width} * 100%)`,
                                position: 'relative',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox={`${-paddingH} ${-paddingV} ${width} ${height}`}
                                >
                                    {sortedList.map(region => (
                                        <RegionShape
                                            key={region.id}
                                            id={region.id}
                                            path={region.path}
                                            href={kqi[region.id] && this.props.buildLink({ mrfId: region.id })}
                                            isActive={kqi[region.id] !== undefined && active === region.id}
                                            onMouseEnter={this.onMouseEnter}
                                            onMouseLeave={this.onMouseLeave}
                                        />
                                    ))}
                                </svg>
                                {list.map(region => {
                                    const relativeLeft = region.nameCoords[0] / width * 100 + '%';
                                    const relativeTop = region.nameCoords[1] / height * 100 + '%';

                                    return (
                                        <RegionInfo
                                            key={region.id}
                                            id={region.id}
                                            name={region.name}
                                            href={kqi[region.id] && this.props.buildLink({ mrfId: region.id })}
                                            coords={{
                                                left: `calc(${paddingH}px + ${relativeLeft})`,
                                                top: `calc(${paddingV}px + ${relativeTop})`,
                                            }}
                                            kqi={kqi[region.id]}
                                            plan={plan}
                                            isActive={active === region.id}
                                            onMouseEnter={this.onMouseEnter}
                                            onMouseLeave={this.onMouseLeave}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MacroMap;

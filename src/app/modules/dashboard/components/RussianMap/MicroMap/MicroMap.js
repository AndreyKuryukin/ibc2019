import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from '../styles.scss';
import data from './data';
import RegionShape from '../RegionShape';
import RegionList from './RegionList';
import RegionInfo from './RegionInfo';

class MicroMap extends React.PureComponent {
    static propTypes = {
        mrfId: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        plan: PropTypes.number,
        kqi: PropTypes.objectOf(PropTypes.number).isRequired,
        padding: PropTypes.number,
    };
    static defaultProps = {
        padding: 0,
    };

    state = {
        active: null,
    };

    active = null;

    componentDidMount() {
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    onResize = () => {
        const { width, height } = this.getSize();

        const mapRatio = width / height;
        const containerRatio = this.wrapper.offsetWidth / this.wrapper.offsetHeight;

        if (mapRatio === containerRatio) return;

        if (mapRatio - containerRatio > 0) {
            this.inner.style.height = 1 / mapRatio * this.wrapper.offsetWidth + 'px';
            this.inner.style.width = '100%';
        } else {
            this.inner.style.width = mapRatio * this.wrapper.offsetHeight + 'px';
            this.inner.style.height = '100%';
        }
    };

    getMRF() {
        return data[this.props.mrfId];
    }

    getSize() {
        const mrf = this.getMRF();
        const initialWidth = mrf.width;
        const initialHeight = mrf.height;
        const paddingH = this.props.padding;
        const paddingV = paddingH / initialWidth * initialHeight;
        const width = initialWidth + paddingH * 2;
        const height = initialHeight + paddingV * 2;

        return { width, height, paddingH, paddingV };
    }

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

        const mrf = this.getMRF();

        if (mrf === undefined) return null;

        const list = Object.values(mrf.regions);
        const sortedList = [...list].sort((a, b) => {
            if (a.id === active) return 1;
            if (b.id === active) return -1;
            return a.id - b.id;
        });

        const rfList = list.map(rf => ({
            id: rf.id,
            name: rf.name,
            pointCoords: rf.pointCoords,
            kqi: this.props.kqi[rf.id],
        }));

        const { width, height, paddingH, paddingV } = this.getSize();

        return (
            <div className={styles.russianMap}>
                <div className={cn(styles.wrapper, styles.micro)}>
                    <div
                        className={styles.container}
                        ref={wrapper => this.wrapper = wrapper}
                    >
                        <div
                            className={styles.inner}
                            ref={inner => this.inner = inner}
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
                                        isActive={active === region.id}
                                        onMouseEnter={this.onMouseEnter}
                                        onMouseLeave={this.onMouseLeave}
                                    />
                                ))}
                            </svg>
                            {list.map(region => {
                                const left = region.pointCoords[0] / width * 100 + '%';
                                const top = region.pointCoords[1] / height * 100 + '%';

                                return (
                                    <RegionInfo
                                        key={region.id}
                                        id={region.id}
                                        coords={{ left, top }}
                                        type={this.props.type}
                                        name={region.name}
                                        plan={plan}
                                        kqi={kqi[region.id]}
                                        isActive={active === region.id}
                                        onMouseEnter={this.onMouseEnter}
                                        onMouseLeave={this.onMouseLeave}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <RegionList
                    className={styles.list}
                    items={rfList}
                    plan={plan}
                    selected={this.state.active}
                    onHoverIn={this.onMouseEnter}
                    onHoverOut={this.onMouseLeave}
                />
            </div>
        );
    }
}

export default MicroMap;

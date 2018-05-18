import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ls from 'i18n';
import styles from './styles.scss';

class Prealoder extends React.PureComponent {
    static propTypes = {
        active: PropTypes.bool,
        text: PropTypes.string,
        children: PropTypes.node,
    };

    static defaultProps = {
        active: false,
        text: ls('PRELOADER_DEFAULT_TEXT', 'Загрузка'),
        children: null,
    };

    render() {
        const { active, text, children } = this.props;

        return (
            <div className={classNames({
                [styles.preloaderWrapper]: true,
                [styles.active]: active,
            })}>
                <div className={styles.layout}>

                    <div className={styles.loader}>
                        <svg xmlns='http://www.w3.org/2000/svg' id='Слой_1' viewBox='0 0 30 30'>
                            <g id='g875'>
                                <path id='path4' d='m 15,24.9 c -0.4,0 -0.9,0 -1.3,-0.1 l -0.5,4 c 0.6,0.1 1.2,0.1 1.8,0.1 0.6,0 1.2,-0.1 1.8,-0.1 l -0.5,-4 c -0.4,0.1 -0.9,0.1 -1.3,0.1 z'
                                      className='st0' opacity='.7' fill='#fff' />
                                <path id='path6' d='m 16.3,24.8 0.5,4 c 1.2,-0.2 2.4,-0.5 3.5,-0.9 l -1.5,-3.7 c -0.8,0.3 -1.6,0.5 -2.5,0.6 z'
                                      className='st1' opacity='.65' fill='#fff' />
                                <path id='path8' d='m 11.2,24.2 -1.5,3.7 c 1.1,0.5 2.3,0.8 3.5,0.9 l 0.5,-4 c -0.9,0 -1.7,-0.2 -2.5,-0.6 z'
                                      className='st2' opacity='.75' fill='#fff' />
                                <path id='path10' d='m 8.9,22.9 -2.4,3.2 c 1,0.7 2,1.4 3.2,1.8 l 1.5,-3.7 C 10.4,23.9 9.6,23.5 8.9,22.9 Z'
                                      className='st3' opacity='.8' fill='#fff' />
                                <path id='path12' d='m 7.1,21.1 -3.2,2.4 c 0.7,1 1.6,1.8 2.6,2.6 L 8.9,22.9 C 8.2,22.4 7.6,21.8 7.1,21.1 Z'
                                      className='st4' opacity='.85' fill='#fff' />
                                <path id='path14' d='m 5.8,18.8 -3.7,1.5 c 0.5,1.1 1.1,2.2 1.8,3.2 L 7.1,21.1 C 6.6,20.4 6.1,19.6 5.8,18.8 Z'
                                      className='st5' opacity='.9' fill='#fff' />
                                <path id='path16' d='m 22.9,21.1 3.2,2.4 c 0.7,-1 1.4,-2 1.8,-3.2 l -3.7,-1.5 c -0.3,0.8 -0.7,1.6 -1.3,2.3 z'
                                      className='st6' opacity='.5' fill='#fff' />
                                <path id='path18' d='m 18.8,24.2 1.5,3.7 c 1.1,-0.5 2.2,-1.1 3.2,-1.8 l -2.4,-3.2 c -0.7,0.6 -1.5,1 -2.3,1.3 z'
                                      className='st7' opacity='.6' fill='#fff' />
                                <path id='path20' d='m 24.9,16.3 c -0.1,0.9 -0.3,1.7 -0.7,2.5 l 3.7,1.5 c 0.5,-1.1 0.8,-2.3 0.9,-3.5 z'
                                      className='st8' opacity='.45' fill='#fff' />
                                <path id='path22' d='m 21.1,22.9 2.4,3.2 c 1,-0.7 1.8,-1.6 2.6,-2.6 l -3.2,-2.4 c -0.5,0.7 -1.1,1.3 -1.8,1.8 z'
                                      className='st9' opacity='.55' fill='#fff' />
                                <path id='path24' d='M 5,15 C 5,14.5 4.8,14 4.4,13.6 4.1,13.2 3.6,13 3,13 c -0.4,0 -0.7,0.1 -1,0.3 -0.6,0.3 -1,1 -1,1.7 0,0.7 0.1,1.4 0.2,2 l 4,-0.6 C 5.1,16 5,15.5 5,15 Z'
                                      className='st10' fill='#fff' />
                                <path id='path26' d='M 24.1,11.1 27.8,9.6 C 27.3,8.5 26.7,7.4 26,6.4 l -3.2,2.4 c 0.6,0.7 1,1.5 1.3,2.3 z'
                                      className='st11' opacity='.3' fill='#fff' />
                                <path id='path28' d='M 22.8,8.8 26,6.4 C 25.3,5.4 24.4,4.6 23.4,3.8 L 21,7 c 0.7,0.5 1.3,1.1 1.8,1.8 z'
                                      className='st12' opacity='.25' fill='#fff' />
                                <path id='path30' d='M 21,7 23.4,3.8 C 22.4,3.1 21.4,2.4 20.2,2 L 18.7,5.7 C 19.5,6 20.3,6.5 21,7 Z'
                                      className='st13' opacity='.2' fill='#fff' />
                                <path id='path32' d='m 24.7,13.6 4,-0.6 C 28.5,11.8 28.2,10.7 27.8,9.6 l -3.7,1.5 c 0.3,0.8 0.5,1.7 0.6,2.5 z'
                                      className='st14' opacity='.35' fill='#fff' />
                                <path id='path34' d='m 24.9,16.3 3.9,0.5 c 0.1,-0.6 0.1,-1.2 0.1,-1.8 0,-0.7 -0.1,-1.3 -0.2,-2 l -4,0.6 c 0.290629,0.916093 0.282229,1.805352 0.2,2.7 z'
                                      className='st15' opacity='.4' fill='#fff' />
                                <path id='path36' d='m 5.2,16.4 -4,0.6 c 0.2,1.2 0.5,2.3 0.9,3.3 L 5.8,18.8 C 5.6,18 5.3,17.2 5.2,16.4 Z'
                                      className='st16' opacity='.95' fill='#fff' />
                                <path id='path38' d='m 14.9,1 c -0.7,0 -1.4,0.4 -1.7,1 -0.2,0.3 -0.3,0.6 -0.3,1 0,0.6 0.2,1.1 0.6,1.4 0.4,0.4 0.9,0.6 1.4,0.6 0.4,0 0.9,0 1.3,0.1 l 0.5,-4 C 16.1,1.1 15.5,1 14.9,1 Z'
                                      className='st17' opacity='.1' fill='#fff' />
                                <path id='path40' d='M 18.7,5.7 20.2,2 C 19.1,1.5 17.9,1.2 16.7,1.1 l -0.5,4 c 0.9,0 1.7,0.2 2.5,0.6 z'
                                      className='st18' opacity='.15' fill='#fff' />
                            </g>
                        </svg>
                        <div>{text}</div>
                    </div>
                </div>
                {children}
            </div>
        );
    }
}

export default Prealoder;

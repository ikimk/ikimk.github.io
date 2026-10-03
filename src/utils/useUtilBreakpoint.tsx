import { useEffect, useState } from 'react';
import { breakpoints } from './constants';

const { screenXXL, screenXL, screenLG, screenMD, screenSM, screenXS } =
  breakpoints;

const useUtilBreakpoint = () => {
  const [XS, setXS] = useState(false);
  const [SM, setSM] = useState(false);
  const [MD, setMD] = useState(false);
  const [LG, setLG] = useState(false);
  const [XL, setXL] = useState(false);
  const [XXL, setXXL] = useState(false);

  useEffect(() => {
    const XS_MediaQuery = window.matchMedia(`(min-width: ${screenXS}px)`);
    const SM_MediaQuery = window.matchMedia(`(min-width: ${screenSM}px)`);
    const MD_MediaQuery = window.matchMedia(`(min-width: ${screenMD}px)`);
    const LG_MediaQuery = window.matchMedia(`(min-width: ${screenLG}px)`);
    const XL_MediaQuery = window.matchMedia(`(min-width: ${screenXL}px)`);
    const XXL_MediaQuery = window.matchMedia(`(min-width: ${screenXXL}px)`);

    const OnChangeXS = (e: any) => {
      setXS(e.matches);
    };
    const OnChangeSM = (e: any) => {
      setSM(e.matches);
    };
    const OnChangeMD = (e: any) => {
      setMD(e.matches);
    };
    const OnChangeLG = (e: any) => {
      setLG(e.matches);
    };
    const OnChangeXL = (e: any) => {
      setXL(e.matches);
    };
    const OnChangeXXL = (e: any) => {
      setXXL(e.matches);
    };

    OnChangeXS(XS_MediaQuery);
    XS_MediaQuery.addListener(OnChangeXS);
    OnChangeSM(SM_MediaQuery);
    SM_MediaQuery.addListener(OnChangeSM);
    OnChangeMD(MD_MediaQuery);
    MD_MediaQuery.addListener(OnChangeMD);
    OnChangeLG(LG_MediaQuery);
    LG_MediaQuery.addListener(OnChangeLG);
    OnChangeXL(XL_MediaQuery);
    XL_MediaQuery.addListener(OnChangeXL);
    OnChangeXXL(XXL_MediaQuery);
    XXL_MediaQuery.addListener(OnChangeXXL);

    return () => {
      XS_MediaQuery.removeListener(OnChangeXS);
      SM_MediaQuery.removeListener(OnChangeSM);
      MD_MediaQuery.removeListener(OnChangeMD);
      LG_MediaQuery.removeListener(OnChangeLG);
      XL_MediaQuery.removeListener(OnChangeXL);
      XXL_MediaQuery.removeListener(OnChangeXXL);
    };
  }, []);

  return { XS, SM, MD, LG, XL, XXL };
};

export default useUtilBreakpoint;

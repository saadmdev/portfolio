'use client';

import React, { useState, Children, useRef, useLayoutEffect, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center px-4 md:px-8 lg:px-12"
      {...rest}
    >
      <div
        className={`mx-auto w-full max-w-4xl rounded-2xl shadow-2xl backdrop-blur-xl bg-white/8 border border-white/30 relative overflow-hidden ${stepCircleContainerClassName}`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3A29FF]/10 via-transparent to-[#FF94B4]/10 opacity-50 pointer-events-none"></div>
        <div className="relative z-10">
          <div className={`${stepContainerClassName} flex w-full items-center p-4 md:p-6 relative z-10`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;

            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: clicked => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={clicked => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}

                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
          </div>

          <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-2 px-4 md:px-6 relative z-10 ${contentClassName}`}
        >
            {stepsArray[currentStep - 1]}
          </StepContentWrapper>

          {!isCompleted && (
            <div className={`px-4 md:px-6 pb-4 md:pb-6 relative z-10 ${footerClassName}`}>
            <div className={`mt-4 md:mt-6 flex ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}>
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`duration-350 rounded-lg px-6 py-3 font-medium transition ${
                    currentStep === 1
                      ? 'pointer-events-none opacity-50 text-neutral-400'
                      : 'text-white/80 hover:text-white hover:bg-white/10 border border-white/20'
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="duration-350 flex items-center justify-center rounded-lg bg-gradient-to-r from-[#3A29FF] to-[#FF94B4] py-3 px-6 font-medium tracking-tight text-white transition hover:from-[#4A39FF] hover:to-[#FFA4C4] active:scale-95 shadow-lg shadow-[#3A29FF]/30"
                {...nextButtonProps}
              >
                {isLastStep ? 'Complete' : nextButtonText}
              </button>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = ''
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={h => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '-100%' : '100%',
    opacity: 0
  }),
  center: {
    x: '0%',
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '50%' : '-50%',
    opacity: 0
  })
};

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps) {
  return <div className="py-6 px-2 md:px-4">{children}</div>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators = false }: StepIndicatorProps) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative cursor-pointer outline-none focus:outline-none"
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#a3a3a3', boxShadow: '0 0 0 0 rgba(58, 41, 255, 0)' },
          active: { scale: 1.15, backgroundColor: '#3A29FF', color: '#fff', boxShadow: '0 0 20px rgba(58, 41, 255, 0.6)' },
          complete: { scale: 1, backgroundColor: '#3A29FF', color: '#fff', boxShadow: '0 0 15px rgba(58, 41, 255, 0.4)' }
        }}
        transition={{ duration: 0.3 }}
        className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full font-semibold border-2 border-white/30"
      >
        {status === 'complete' ? (
          <CheckIcon className="h-5 w-5 text-white" />
        ) : status === 'active' ? (
          <div className="h-4 w-4 rounded-full bg-white" />
        ) : (
          <span className="text-sm text-white/70">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    complete: { width: '100%', backgroundColor: '#3A29FF' }
  };

  return (
    <div className="relative mx-4 h-1 flex-1 overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}


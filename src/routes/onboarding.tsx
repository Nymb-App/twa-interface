import { ActionButton } from '@/components/ui/action-button'
import type { CarouselApi } from '@/components/ui/carousel'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { PageLayout } from '@/components/ui/page-layout'
import { AppContext } from '@/context/app-context'
import { useAccountMe } from '@/hooks/api/use-account'
import { cn } from '@/lib/utils'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function renderHighlighted(text?: string, highlights: Array<string> = []) {
  if (!text) return null
  const set = new Set(highlights.map((h) => h.trim().toLowerCase()))
  return text.split(/(\s+)/).map((token, i) => {
    if (/^\s+$/.test(token)) return token
    const plain = token.replace(/[,!.:?;]+$/g, '')
    const suffix = token.slice(plain.length)
    const isHl = set.has(plain.toLowerCase())
    return (
      <span
        key={`${plain}-${i}`}
        className={isHl ? 'text-[#B6FF00]' : undefined}
      >
        {plain}
        {suffix}
      </span>
    )
  })
}

export const Route = createFileRoute('/onboarding')({
  component: OnboardingScreen,
})

function OnboardingScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [api, setApi] = useState<CarouselApi | undefined>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const { accountQuery, finishOnboardingMutation } = useAccountMe()
  const { setCurrentOnboardingSlide, setIsOnboardingCompleted } =
    useContext(AppContext)

  const slides = [
    {
      id: 1,
      title: t('onboarding.slides.1.title'),
      subtitle: t('onboarding.slides.1.subtitle'),
      image: '/onboarding/first-slide-img.webp',
      bgImage: '/onboarding/first-slide-bg.png',
      highlightWords: t('onboarding.slides.1.highlight', {
        returnObjects: true,
      }) as string[],
    },
    {
      id: 2,
      title: t('onboarding.slides.2.title'),
      subtitle: t('onboarding.slides.2.subtitle'),
      image: '/onboarding/second-slide-img.webp',
      bgImage: '/onboarding/second-slide-bg.png',
      highlightWords: t('onboarding.slides.2.highlight', {
        returnObjects: true,
      }) as string[],
    },
    {
      id: 3,
      title: t('onboarding.slides.3.title'),
      subtitle: t('onboarding.slides.3.subtitle'),
      image: '/onboarding/third-slide-img.webp',
      bgImage: '/onboarding/third-slide-bg.png',
      highlightWords: t('onboarding.slides.3.highlight', {
        returnObjects: true,
      }) as string[],
    },
    {
      id: 4,
      title: t('onboarding.slides.4.title'),
      subtitle: t('onboarding.slides.4.subtitle'),
      subtitle2: t('onboarding.slides.4.subtitle2'),
      image: '/onboarding/fourth-slide-img.webp',
      bgImage: '/onboarding/fourth-slide-bg.png',
      highlightWords: t('onboarding.slides.4.highlight', {
        returnObjects: true,
      }) as string[],
    },
    {
      id: 5,
    },
  ]

  useEffect(() => {
    if (accountQuery.data && !accountQuery.data.isFinishOnboarding)
      finishOnboardingMutation.mutate()
  }, [accountQuery.data])

  useEffect(() => {
    if (!api) return
    setCurrentOnboardingSlide(api)
    if (currentIndex === slides.length - 1) {
      setIsOnboardingCompleted(true)
      navigate({ to: '/' })
    }
    const onSelect = () => setCurrentIndex(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api, currentIndex])

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      api?.scrollNext()
    } else {
      setIsOnboardingCompleted(true)
      navigate({ to: '/' })
    }
  }

  return (
    <PageLayout useFooter={false} className="top-0 relative">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              {slide.id === 1 && (
                <div
                  className="absolute bg-no-repeat bg-[url('/onboarding/onboarding-bg-1.png')]"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                  }}
                />
              )}

              {slide.id === 2 && (
                <div
                  className="absolute bg-no-repeat bg-[url('/onboarding/onboarding-bg-2.png')]"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                  }}
                />
              )}

              {slide.id === 3 && (
                <div
                  className="absolute bg-no-repeat bg-[url('/onboarding/onboarding-bg-3.png')]"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                  }}
                />
              )}

              {slide.id === 4 && (
                <div
                  className="absolute bg-no-repeat bg-[url('/onboarding/onboarding-bg-4.png')]"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                  }}
                />
              )}

              {slide.id === 5 && (
                <div className="w-full h-full relative">
                  <div className="w-full h-full bg-[#121312]" />
                  <div
                    className="absolute top-[1px] left-[-8px] bg-no-repeat bg-[url('/onboarding/onboarding-bg-4.png')]"
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundSize: 'cover',
                      transform: 'scaleX(-1)',
                    }}
                  />
                </div>
              )}
              {slide.id !== 5 && (
                <>
                  <div className="flex justify-center items-center mb-10 mt-28">
                    <div
                      className={cn(
                        'relative w-full h-full aspect-[370/365]',
                        slide.id === 1 && 'ml-4',
                        slide.id === 4 && 'aspect-[390/341]',
                      )}
                    >
                      <img
                        src={slide.image}
                        className={cn(
                          'w-full h-full object-contain',
                          slide.id === 2 && 'object-cover',
                        )}
                        alt="image"
                        loading="eager"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <h1 className="font-pixel uppercase text-[30px] mb-2 leading-[40px]">
                      <span className="block">
                        {renderHighlighted(slide.title, slide.highlightWords)}
                      </span>
                      {slide.subtitle && (
                        <span className="block">
                          {renderHighlighted(
                            slide.subtitle,
                            slide.highlightWords,
                          )}
                        </span>
                      )}
                      {slide.subtitle2 && (
                        <span className="block">
                          {renderHighlighted(
                            slide.subtitle2,
                            slide.highlightWords,
                          )}
                        </span>
                      )}
                    </h1>
                    <p className="text-[#FFFFFF]/60 text-sm">
                      {slide.id === 3 ? (
                        <>
                          {t('onboarding.slides.3.description.line1')}
                          <br />
                          {t('onboarding.slides.3.description.line2')}
                        </>
                      ) : (
                        <>
                          {t('onboarding.slides.1.description.line1')}
                          <br />
                          {t('onboarding.slides.1.description.line2')}
                        </>
                      )}
                    </p>
                  </div>
                </>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {slides[currentIndex].id !== 5 && (
        <div className="fixed bottom-0 z-50 w-full max-w-[450px] bg-[#121312] px-4 pb-12 left-1/2 -translate-x-1/2">
          <ActionButton onClick={handleNext} className="text-[#000000]">
            {t('common.next')}
          </ActionButton>
        </div>
      )}
    </PageLayout>
  )
}

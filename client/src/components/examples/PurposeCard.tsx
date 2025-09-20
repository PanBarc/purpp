import PurposeCard, { PurposeCardData } from '../PurposeCard'
import familyImage from '@assets/generated_images/Family_purpose_card_image_6846aeb5.png'

const sampleCard: PurposeCardData = {
  id: 'family',
  title: 'Family',
  description: 'Building strong relationships with loved ones and creating lasting memories together.',
  image: familyImage,
  category: 'Relationships'
}

export default function PurposeCardExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <PurposeCard
        card={sampleCard}
        onSwipeLeft={() => console.log('Swiped left on Family')}
        onSwipeRight={() => console.log('Swiped right on Family')}
      />
    </div>
  )
}
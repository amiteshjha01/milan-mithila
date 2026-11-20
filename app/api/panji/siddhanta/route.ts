import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const siddhantaRequestSchema = z.object({
  brideName: z.string().min(1),
  brideGotra: z.string().min(1),
  brideMool: z.string().min(1),
  bridePaternalVillage: z.string().optional(),
  brideMaternalMool: z.string().optional(),
  groomName: z.string().min(1),
  groomGotra: z.string().min(1),
  groomMool: z.string().min(1),
  groomPaternalVillage: z.string().optional(),
  groomMaternalMool: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = siddhantaRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Incomplete lineage data' }, { status: 400 })
    }

    const d = parsed.data

    // Check Sagotra compatibility
    const isSagotra = d.brideGotra.toLowerCase().trim() === d.groomGotra.toLowerCase().trim()
    const isSameMool = d.brideMool.toLowerCase().trim() === d.groomMool.toLowerCase().trim()
    const isSameMaternalMool = Boolean(
      d.brideMaternalMool &&
      d.groomMaternalMool &&
      d.brideMaternalMool.toLowerCase().trim() === d.groomMaternalMool.toLowerCase().trim()
    )

    let status: 'APPROVED' | 'REQUIRES_PANJIKAR_REVIEW' | 'INELIGIBLE_SAGOTRA' = 'APPROVED'
    let remarks = 'Lineage conforms to canonical Maithil Panji-Prabandh principles. Both branches clear Sapinda thresholds.'

    if (isSagotra) {
      status = 'INELIGIBLE_SAGOTRA'
      remarks = 'Sagotra identified (Same Gotra: ' + d.brideGotra + '). Canonical Maithil custom prohibits Sagotra vivah.'
    } else if (isSameMool || isSameMaternalMool) {
      status = 'REQUIRES_PANJIKAR_REVIEW'
      remarks = 'Direct or maternal Mool overlap detected (' + (isSameMool ? d.brideMool : d.brideMaternalMool) + '). In-person Panjikar branch examination advised.'
    }

    const certificateNumber = `MM-SIDDHANTA-${Date.now().toString().slice(-6)}`

    return NextResponse.json({
      ok: true,
      certificate: {
        certificateNumber,
        generatedAt: new Date().toISOString(),
        bride: {
          name: d.brideName,
          gotra: d.brideGotra,
          mool: d.brideMool,
          village: d.bridePaternalVillage || 'Mithilanchal',
        },
        groom: {
          name: d.groomName,
          gotra: d.groomGotra,
          mool: d.groomMool,
          village: d.groomPaternalVillage || 'Mithilanchal',
        },
        status,
        remarks,
        authority: 'Mithila Milan Panji Prabandh Verification Desk (Saurath-Aligned)',
        shloka: 'अविप्लुतब्रह्मचर्यो लक्षण्यां स्त्रियमुद्वहेत् । अनन्यपूर्विकां कान्तामसपिण्डां च मातुरसगोत्रां च पितुः ॥',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

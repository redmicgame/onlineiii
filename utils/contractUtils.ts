import { Contract } from '../types';

export const createDefaultContract = (overrides: Partial<Contract>): Contract => {
    return {
        labelId: overrides.labelId || '',
        isCustom: overrides.isCustom || false,
        artistId: overrides.artistId || '',
        startDate: overrides.startDate || { week: 1, year: 2024 },
        albumsReleased: overrides.albumsReleased || 0,
        
        durationWeeks: overrides.durationWeeks ?? 104,
        albumQuota: overrides.albumQuota ?? 2,
        advance: overrides.advance ?? 0,
        royaltyPercent: overrides.royaltyPercent ?? 15,
        
        mastersOwnership: overrides.mastersOwnership ?? 'Label',
        mastersSplitPercent: overrides.mastersSplitPercent ?? 0,
        publishingRights: overrides.publishingRights ?? 'Label',
        publishingSplitPercent: overrides.publishingSplitPercent ?? 50,
        reversionClause: overrides.reversionClause ?? false,
        
        tourSupport: overrides.tourSupport ?? 0,
        marketingBudget: overrides.marketingBudget ?? 0,
        merchPercent: overrides.merchPercent ?? 50,
        streamingSplitArtist: overrides.streamingSplitArtist ?? 15,
        sponsorshipSplitArtist: overrides.sponsorshipSplitArtist ?? 80,
        recoupmentTerms: overrides.recoupmentTerms ?? '100%',
        successBonus: overrides.successBonus ?? 0,
        chartIncentives: overrides.chartIncentives ?? 'None',
        revenueAuditRights: overrides.revenueAuditRights ?? false,
        producerSplitsLabelPaid: overrides.producerSplitsLabelPaid ?? false,
        
        creativeControl: overrides.creativeControl ?? 'Medium',
        releaseDeadlines: overrides.releaseDeadlines ?? true,
        exclusivity: overrides.exclusivity ?? true,
        collabPermissions: overrides.collabPermissions ?? 'Label Approval',
        socialMediaObligations: overrides.socialMediaObligations ?? 'Moderate',
        brandingApproval: overrides.brandingApproval ?? 'Label',
        performanceRequirements: overrides.performanceRequirements ?? 'Standard promos',
        independentRestrictions: overrides.independentRestrictions ?? true,
        distributionRegions: overrides.distributionRegions ?? 'Worldwide',
        licensingRights: overrides.licensingRights ?? 'Label',
        
        renewalOptions: overrides.renewalOptions ?? true,
        earlyTermination: overrides.earlyTermination ?? false,
        penaltyAmount: overrides.penaltyAmount ?? 1000000,
        nda: overrides.nda ?? true,
        disputeTerms: overrides.disputeTerms ?? 'Arbitration in NY',
    };
};

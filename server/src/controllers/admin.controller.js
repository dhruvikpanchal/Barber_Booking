import { prisma } from '../config/prismaClient.js';

// Utils
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  getPaginationParams,
  paginationFn,
  formatSlot,
  parseDateUTC,
  getStartOfDayUTC,
  getEndOfDayUTC,
  getLast7DaysUTC,
} from '../utils/index.js';

// Helper Functions
import { VerifyAndUpdatePassword } from '../helpers/ChangePasswordHelper.js';
import { uploadProfileImage } from '../helpers/updateImageHelper.js';

/*===========================================================================
                            Main Functions
=============================================================================*/

// [1] Get Admin Profile

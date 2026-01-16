# File Naming Standardization Guide

## Component Naming Standards

To maintain consistency across the codebase, all React component files should use **PascalCase** naming, while CSS modules and other non-component files should use **kebab-case**.

## Files to Rename

### Current Inconsistent Component Files:
1. `Createcourse.tsx` → `CreateCourse.tsx`
2. `coursestructure.tsx` → `CourseStructure.tsx`
3. `coursesettings.tsx` → `CourseSettings.tsx`
4. `courseprice.tsx` → `CoursePrice.tsx`
5. `courseseo.tsx` → `CourseSeo.tsx`
6. `recommendedcourses.tsx` → `RecommendedCourses.tsx`
7. `coursepatrons.tsx` → `CoursePatrons.tsx`
8. `courselogs.tsx` → `CourseLogs.tsx`

### CSS Module Files:
- `createcourse.module.css` → `create-course.module.css`
- `coursepage.module.css` → `course-page.module.css`

## Updating References

After renaming the files, you'll need to update all import statements. Here's an example of how to change the imports in `CreateCourse.tsx`:

```tsx
// Before
import CourseStructure from "./coursestructure";
import CourseSettings from "./coursesettings";
import CoursePrice from "./courseprice";
import Seo from "./courseseo";
import RecommendedCourses from "./recommendedcourses";
import Patrons from "./coursepatrons";
import Logs from "./courselogs";
import styles from './createcourse.module.css';

// After
import CourseStructure from "./CourseStructure";
import CourseSettings from "./CourseSettings";
import CoursePrice from "./CoursePrice";
import Seo from "./CourseSeo";
import RecommendedCourses from "./RecommendedCourses";
import Patrons from "./CoursePatrons";
import Logs from "./CourseLogs";
import styles from './create-course.module.css';
```

## Files That Reference These Components:
- `src/app/dashboard/courses/[tab]/page.tsx`
- `src/app/dashboard/courses/[tab]/[id]/page.tsx`

## Tools for Easy Renaming

You can use VS Code's rename functionality or Git to handle the file renames:

### Using Git:
```bash
git mv src/app/dashboard/courses/Createcourse.tsx src/app/dashboard/courses/CreateCourse.tsx
git mv src/app/dashboard/courses/coursestructure.tsx src/app/dashboard/courses/CourseStructure.tsx
# And so on for each file
```

### VS Code Search and Replace:
Use VS Code's global search to find all instances of the old import statements and replace them with the new ones.

## Testing After Renaming

After completing the renaming process:

1. Run the development server to check for any broken imports or references
2. Test each component to ensure they're still functioning correctly
3. Check the styling to confirm CSS modules are still properly imported

## Benefits of Standardization

- Improved code readability and maintainability
- Easier code navigation
- Follows React and Next.js community conventions
- Eliminates confusion between component names and file names